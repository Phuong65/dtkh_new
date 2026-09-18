import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, mergeMap, Observable, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { Course } from '@models/course';
import { CoursePlanActivities } from '@models/dtkh/course-plan-activities';
import { ConditionOption } from '@models/condition-option';
import { IctuQueryCondition } from '@models/dto';
import { AppState } from '@models/app-state';
import { CourseService } from '@services/course.service';
import { CoursePlanActivitiesService } from '@services/course-plan-activities.service';
import { CourseQuestionsService } from '@services/course-questions.service';
import { CoursePlanBankService } from '@services/course-plan-bank.service';
import { CourseFormCcService } from '@services/course-form-cc.service';
import { CourseFormDgService } from '@services/course-form-dg.service';
import { CourseFormTxService } from '@services/course-form-tx.service';
import { SINHDECC } from '@models/dtkh/course-form-cc';
import { SINHDETX } from '@models/dtkh/course-form-tx';
import { AuthenticationService } from '@services/authentication.service';
import { NotificationService } from '@services/notification.service';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Helper } from '@utilities/helper';
import { Date2textPipe } from '@pipes/date2text.pipe';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';

export interface WeekPlanRow extends CoursePlanActivities {
    datuyet_question?: number;
    has_form_cc?: boolean;
    has_form_dg?: boolean;
    has_test_cc?: boolean;
    has_test_dg?: boolean;
}

export interface PlanWithMeta extends CoursePlanActivities {
    has_form_test?: boolean;
    has_question?: string;
    _question_dat?: number;
    has_test?: boolean;
    icon?: string;
}

@Component({
    selector: 'app-monhoc-kiemtra-danhgia',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        TabsModule,
        TooltipModule,
        MatButtonModule,
        LoadingProgressComponent,
        Date2textPipe,
        SafeHtmlPipe
    ],
    templateUrl: './monhoc-kiemtra-danhgia.component.html',
    styleUrl: './monhoc-kiemtra-danhgia.component.css'
})
export class MonhocKiemtraDanhgiaComponent implements OnInit {
    readonly course = input<Course | null>(null);
    readonly courseId = input<number>(0);

    readonly state: WritableSignal<AppState> = signal<AppState>('loading');
    readonly saving = signal<boolean>(false);

    private readonly route = inject(ActivatedRoute);
    private readonly courseService = inject(CourseService);
    private readonly coursePlanActivitiesService = inject(CoursePlanActivitiesService);
    private readonly courseQuestionsService = inject(CourseQuestionsService);
    private readonly coursePlanBankService = inject(CoursePlanBankService);
    private readonly courseFormCcService = inject(CourseFormCcService);
    private readonly courseFormDgService = inject(CourseFormDgService);
    private readonly courseFormTxService = inject(CourseFormTxService);
    private readonly auth = inject(AuthenticationService);
    private readonly notificationService = inject(NotificationService);

    isManager = false;
    isLanhDaoKhoa = false;
    isLanhDaoBomon = false;
    routerAdmin = false;
    routerDaotao = false;
    routerLanhdaokhoa = false;
    routerGiangvien = false;
    routerLanhdaobomon = false;
    userId = 0;
    canAdded = false;

    selectedCourse: Course | null = null;
    list_week: WeekPlanRow[] = [];
    label_week = 'Bài';
    number_test_config: Record<string, number> = { CC_TEST: 1, TX_TEST: 1 };
    tabIndex = 0;
    closeLeft = false;
    selectPlan: PlanWithMeta | null = null;
    list_plan: CoursePlanActivities[] = [];
    indexByKeyServerInSotinchi: number | null = null;
    showTests = false;
    readonly isDttx = false;
    readonly key_server: string = 'ictu';

    private loadedCourseId = 0;

    constructor() {
        this.setupPermissions();

        effect(() => {
            const courseObj = this.course();
            const id = courseObj?.id || this.courseId();
            if (id && id !== this.loadedCourseId) {
                this.loadCourseData(id, courseObj || undefined);
            }
        });
    }

    ngOnInit(): void {
        this.setupPermissions();
        this.loadLocalConfig();

        if (!this.course()?.id && !this.courseId()) {
            const queryCode = Number(this.route.snapshot.queryParamMap.get('code') || this.route.snapshot.paramMap.get('id'));
            if (queryCode && queryCode !== this.loadedCourseId) {
                this.loadCourseData(queryCode);
            }
        }
    }

    private setupPermissions(): void {
        const roles = this.auth.roles.map(role => String(role.name));
        this.userId = this.auth.user?.id || 0;
        this.isManager = roles.some(role => ['truong_ld', 'admin', 'administrator', 'daotao_troly', 'daotao_ld', 'manager', 'chuyenvien_pdt', 'troly_pdt'].includes(role));
        this.isLanhDaoKhoa = roles.includes('khoa_ld') || roles.includes('lanhdaokhoa');
        this.isLanhDaoBomon = roles.includes('bomon_ld') || roles.includes('lanhdaobomon');
        this.routerAdmin = roles.some(role => ['admin', 'administrator', 'truong_ld'].includes(role));
        this.routerDaotao = roles.some(role => ['daotao_ld', 'daotao_troly'].includes(role));
        this.routerLanhdaokhoa = this.isLanhDaoKhoa;
        this.routerLanhdaobomon = this.isLanhDaoBomon;
        this.routerGiangvien = roles.includes('teacher') || roles.includes('giangvien');
    }

    private loadLocalConfig(): void {
        try {
            const apConfigs = this.auth.configs;
            const found = apConfigs.find(m => m.config_key === 'NUMOF_TEST_CCTX');
            if (found?.params) {
                this.number_test_config = found.params;
            }
        } catch {
            this.number_test_config = { CC_TEST: 1, TX_TEST: 1 };
        }
    }

    private loadCourseData(id: number, suppliedCourse?: Course): void {
        this.loadedCourseId = id;
        this.state.set('loading');
        this.notificationService.isProcessing(true);

        const course$ = suppliedCourse ? of(suppliedCourse) : this.courseService.getCourseById(id);

        course$.subscribe({
            next: (course) => {
                if (course && course.id) {
                    this.selectedCourse = course;
                    this.canAdded = this.routerDaotao || this.routerLanhdaobomon || this.routerLanhdaokhoa || this.userId === course.creator_plan_id;
                    this.indexByKeyServerInSotinchi = course.params?.sotinchi ?? course.sotinchi ?? 0;
                    this.loadTest();
                } else {
                    this.state.set('error');
                    this.notificationService.toastError('Không tìm thấy môn học');
                    this.notificationService.isProcessing(false);
                }
            },
            error: () => {
                this.state.set('error');
                this.notificationService.toastError('Lỗi kết nối, vui lòng thử lại');
                this.notificationService.isProcessing(false);
            }
        });
    }

    loadTest(): void {
        if (!this.selectedCourse?.id) return;
        const courseId = this.selectedCourse.id.toString();

        const condition_lesson: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId, orWhere: 'and' },
                { conditionName: 'week', condition: IctuQueryCondition.notEqual, value: '0', orWhere: 'and' },
                { conditionName: 'week', condition: IctuQueryCondition.lessThan, value: '100', orWhere: 'and' },
                { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-3', orWhere: 'and' },
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'include', value: 'ACTIVITY_CDR,PLAN' },
                { label: 'include_by', value: 'type' },
                { label: 'orderby', value: 'week' },
                { label: 'order', value: 'ASC' }
            ],
            page: null
        };

        const condition_plan_bank: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId, orWhere: 'and' },
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'select', value: 'week,id,bank_type' },
                { label: 'include', value: 'CC,DG' },
                { label: 'include_by', value: 'bank_type' }
            ],
            page: null
        };

        const condition_form_week: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId, orWhere: 'and' },
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'select', value: 'week,id' },
                { label: 'groupby', value: 'week' }
            ],
            page: null
        };

        this.notificationService.isProcessing(true);

        forkJoin({
            plan_activity: this.coursePlanActivitiesService.getCoursePlanActivitiesByPageNew(condition_lesson),
            bank: this.coursePlanBankService.getCoursePlanBankByPageNew(condition_plan_bank),
            form_cc: this.courseFormCcService.getCourseFormCcByPage(condition_form_week),
            form_dg: this.courseFormDgService.getCourseFormDgByPage(condition_form_week),
            question: this.loadQuestions(courseId)
        }).subscribe({
            next: ({ plan_activity, bank, form_cc, form_dg, question }) => {
                const bankDgWeeks = new Set((bank.data || []).filter(i => i.bank_type === 'DG').map(m => m.week));
                const bankCcWeeks = new Set((bank.data || []).filter(i => i.bank_type === 'CC').map(m => m.week));
                const formCcWeeks = new Set((form_cc.data || []).map(m => m.week));
                const formDgWeeks = new Set((form_dg.data || []).map(m => m.week));

                const parents = (plan_activity.data || []).filter(m => m.parent_id === 0) as WeekPlanRow[];
                const questionData = question?.data || [];

                parents.forEach(f => {
                    f.datuyet_question = questionData.filter((m: any) => m.week === f.week).length;
                    const children = (plan_activity.data || []).filter(m => m.parent_id === f.id);
                    f.children = Helper.arraySort(children, 'ordering');
                    f.has_form_cc = formCcWeeks.has(f.week);
                    f.has_form_dg = formDgWeeks.has(f.week);
                    f.has_test_cc = bankCcWeeks.has(f.week);
                    f.has_test_dg = bankDgWeeks.has(f.week);
                });

                this.list_week = parents;
                this.state.set('success');
                this.notificationService.isProcessing(false);
            },
            error: () => {
                this.state.set('error');
                this.notificationService.isProcessing(false);
            }
        });
    }

    private loadQuestions(courseId: string): Observable<any> {
        const condition_parent: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId, orWhere: 'and' },
                { conditionName: 'week', condition: IctuQueryCondition.lessThan, value: '100', orWhere: 'and' },
                { conditionName: 'reference', condition: IctuQueryCondition.equal, value: 'course_plan_activities', orWhere: 'and' },
                { conditionName: 'status', condition: IctuQueryCondition.equal, value: '1', orWhere: 'and' },
                { conditionName: 'group_id', condition: IctuQueryCondition.equal, value: '0', orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'select', value: 'status,id,cdr,reference_id,week,created_at' }
            ],
            page: null
        };

        return this.courseQuestionsService.getCourseQuestionsByPageNew(condition_parent).pipe(
            mergeMap(res => {
                if (this.selectedCourse?.av !== 1 || !res.data?.length) return of(res);

                const group_ids = [...res.data.map(m => m.id), -1];
                const condition_child: ConditionOption = {
                    condition: [
                        { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId, orWhere: 'and' },
                    ],
                    set: [
                        { label: 'limit', value: '-1' },
                        { label: 'include', value: group_ids.toString() },
                        { label: 'include_by', value: 'group_id' },
                        { label: 'select', value: 'status,id,cdr,reference_id,week' }
                    ],
                    page: null
                };
                return this.courseQuestionsService.getCourseQuestionsByPageNew(condition_child);
            })
        );
    }

    async sinhDeByWeek(row: WeekPlanRow): Promise<void> {
        if (!this.selectedCourse) return;
        const confirm = await firstValueFrom(
            this.notificationService.confirmDelete2({
                heading: 'Xác nhận hành động',
                htmlMessage: `Thầy/Cô có chắc chắn muốn sinh đề trắc nghiệm ${this.label_week} ${row.week}?`
            })
        );

        if (confirm) {
            const data: SINHDECC = {
                course_id: this.selectedCourse.id,
                week: row.week,
                limit: this.number_test_config['CC_TEST'] || 1
            };
            this.saving.set(true);
            this.notificationService.isProcessing(true);
            this.courseFormCcService.sinhde(data).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.loadTest();
                    this.notificationService.toastInfo('Đã sinh đề xong, vui lòng kiểm tra');
                    this.notificationService.isProcessing(false);
                },
                error: () => {
                    this.saving.set(false);
                    this.notificationService.isProcessing(false);
                    this.notificationService.toastError('Sinh đề thất bại, vui lòng thử lại');
                }
            });
        }
    }

    async deleteDeWeek(row: WeekPlanRow): Promise<void> {
        if (!this.selectedCourse) return;
        const confirm = await firstValueFrom(this.notificationService.confirmDelete(1));
        if (confirm) {
            this.saving.set(true);
            this.notificationService.isProcessing(true);
            const condition_plan_bank: ConditionOption = {
                condition: [
                    { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                    { conditionName: 'bank_type', condition: IctuQueryCondition.equal, value: 'CC', orWhere: 'and' },
                    { conditionName: 'week', condition: IctuQueryCondition.equal, value: row.week.toString(), orWhere: 'and' },
                ],
                set: [
                    { label: 'limit', value: '-1' },
                    { label: 'select', value: 'id' },
                ],
                page: null
            };

            this.coursePlanBankService.getCoursePlanBankByPageNew(condition_plan_bank).pipe(
                mergeMap(_test => {
                    const ids = (_test.data || []).map(m => m.id);
                    if (ids.length) {
                        return this.coursePlanBankService.deleteCoursePlanBank(ids.toString());
                    }
                    return of(null);
                })
            ).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.notificationService.isProcessing(false);
                    this.notificationService.toastSuccess('Xóa thành công');
                    this.loadTest();
                },
                error: () => {
                    this.saving.set(false);
                    this.notificationService.isProcessing(false);
                    this.notificationService.toastError('Xóa thất bại');
                }
            });
        }
    }

    async sinhDe15pByWeek(row: WeekPlanRow): Promise<void> {
        if (!this.selectedCourse) return;
        const confirm = await firstValueFrom(
            this.notificationService.confirmDelete2({
                heading: 'Xác nhận hành động',
                htmlMessage: `Thầy/Cô có chắc chắn muốn sinh đề trắc nghiệm 15p ${this.label_week} ${row.week}?`
            })
        );

        if (confirm) {
            const data = {
                course_id: this.selectedCourse.id,
                week: row.week,
                limit: this.number_test_config['CC_TEST'] || 1
            };
            this.saving.set(true);
            this.notificationService.isProcessing(true);
            this.courseFormDgService.sinhde(data).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.loadTest();
                    this.notificationService.toastInfo('Đã sinh đề xong, vui lòng kiểm tra');
                    this.notificationService.isProcessing(false);
                },
                error: () => {
                    this.saving.set(false);
                    this.notificationService.isProcessing(false);
                    this.notificationService.toastError('Sinh đề thất bại, vui lòng thử lại');
                }
            });
        }
    }

    async delete15pDeByWeek(row: WeekPlanRow): Promise<void> {
        if (!this.selectedCourse) return;
        const confirm = await firstValueFrom(this.notificationService.confirmDelete(1));
        if (confirm) {
            this.saving.set(true);
            this.notificationService.isProcessing(true);
            const condition_plan_bank: ConditionOption = {
                condition: [
                    { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                    { conditionName: 'bank_type', condition: IctuQueryCondition.equal, value: 'DG', orWhere: 'and' },
                    { conditionName: 'week', condition: IctuQueryCondition.equal, value: row.week.toString(), orWhere: 'and' },
                ],
                set: [
                    { label: 'limit', value: '-1' },
                    { label: 'select', value: 'id' },
                ],
                page: null
            };

            this.coursePlanBankService.getCoursePlanBankByPageNew(condition_plan_bank).pipe(
                mergeMap(_test => {
                    const ids = (_test.data || []).map(m => m.id);
                    if (ids.length) {
                        return this.coursePlanBankService.deleteCoursePlanBank(ids.toString());
                    }
                    return of(null);
                })
            ).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.notificationService.isProcessing(false);
                    this.notificationService.toastSuccess('Xóa thành công');
                    this.loadTest();
                },
                error: () => {
                    this.saving.set(false);
                    this.notificationService.isProcessing(false);
                    this.notificationService.toastError('Xóa thất bại');
                }
            });
        }
    }

    onTabChange(index: string | number): void {
        const numIndex = Number(index);
        this.tabIndex = numIndex;
        if (numIndex === 0) {
            this.loadTest();
        } else if (numIndex === 1) {
            this.loadThuongxuyen();
        }
    }

    loadThuongxuyen(): void {
        if (!this.selectedCourse?.id) return;
        this.notificationService.isProcessing(true);
        const condition_test: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                { conditionName: 'week', condition: IctuQueryCondition.equal, value: '1000', orWhere: 'and' },
                { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-3', orWhere: 'and' },
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'orderby', value: 'ordering' },
                { label: 'order', value: 'ASC' }
            ],
            page: null
        };

        this.coursePlanActivitiesService.getCoursePlanActivitiesByPageNew(condition_test).subscribe({
            next: (_test) => {
                const parents = (_test.data || []).filter(m => m.parent_id === 0);

                parents.forEach(f => {
                    f.children = (_test.data || []).filter(m => m.parent_id === f.id);
                    f.children.forEach((c: PlanWithMeta) => {
                        switch (c.type) {
                            case 'THUONGXUYEN_TRACNGHIEM':
                                c.icon = 'fa fa-clock-o';
                                break;
                            case 'THUONGXUYEN_TULUAN':
                                c.icon = 'fa fa-pencil-square-o';
                                break;
                            case 'THUONGXUYEN_DUAN':
                                c.icon = 'fa fa-book';
                                break;
                            default:
                                break;
                        }
                    });

                    if (f.children && f.children.length) {
                        this.showTests = true;
                    }
                });

                this.list_plan = parents;
                this.notificationService.isProcessing(false);
            },
            error: () => {
                this.notificationService.isProcessing(false);
            }
        });
    }

    closeLeftBody(): void {
        this.closeLeft = !this.closeLeft;
    }

    onChangePlan(plan: PlanWithMeta): void {
        this.selectPlan = plan;
        if (this.selectPlan?.type === 'THUONGXUYEN_TRACNGHIEM') {
            this.loadTestTracnghiem();
        }
    }

    loadTestTracnghiem(): void {
        if (!this.selectedCourse || !this.selectPlan) return;
        this.notificationService.isProcessing(true);

        const condtion_form_test: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                { conditionName: 'ordering', condition: IctuQueryCondition.equal, value: this.selectPlan.ordering.toString(), orWhere: 'and' },
                { conditionName: 'av', condition: IctuQueryCondition.equal, value: (this.selectedCourse.av || 0).toString(), orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' }
            ],
            page: null
        };

        const condition_form_bank: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                { conditionName: 'bank_type', condition: IctuQueryCondition.equal, value: 'TX', orWhere: 'and' },
                { conditionName: 'week', condition: IctuQueryCondition.equal, value: '100', orWhere: 'and' },
                { conditionName: 'ordering', condition: IctuQueryCondition.equal, value: this.selectPlan.ordering.toString(), orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '1' },
            ],
            page: null
        };

        forkJoin([
            this.courseFormTxService.getCoursePlansByPageNew(condtion_form_test).pipe(
                mergeMap(a => {
                    let reference_ids: string[] = [];
                    (a.data || []).forEach(f => {
                        if (f.course_plan_activity_id) {
                            reference_ids = reference_ids.concat(f.course_plan_activity_id.split(','));
                        }
                    });

                    if (reference_ids.length) {
                        const condtion_question: ConditionOption = {
                            condition: [
                                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: this.selectedCourse!.id.toString(), orWhere: 'and' },
                                { conditionName: 'reference', condition: IctuQueryCondition.equal, value: 'course_plan_activities', orWhere: 'and' },
                                { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-3', orWhere: 'and' },
                            ],
                            set: [
                                { label: 'limit', value: '-1' },
                                { label: 'include', value: reference_ids.toString() },
                                { label: 'include_by', value: 'reference_id' },
                                { label: 'select', value: 'id,status,group_id' }
                            ],
                            page: null
                        };

                        return this.courseQuestionsService.getCourseQuestionsByPageNew(condtion_question).pipe(
                            mergeMap(questionsResult => {
                                if (this.selectedCourse?.av === 1) {
                                    const parentStatusMap: Record<number, number> = {};
                                    const childs: any[] = [];
                                    (questionsResult.data || []).forEach(q => {
                                        if (+q.group_id === 0) {
                                            parentStatusMap[q.id] = q.status;
                                        } else {
                                            childs.push(q);
                                        }
                                    });
                                    childs.forEach(c => {
                                        if (parentStatusMap[c.group_id] !== undefined) {
                                            c.status = parentStatusMap[c.group_id];
                                        }
                                    });
                                    questionsResult.data = childs;
                                }
                                return of(questionsResult);
                            })
                        );
                    }

                    return of(null);
                })
            ),
            this.coursePlanBankService.getCoursePlanBankByPageNew(condition_form_bank)
        ]).subscribe({
            next: ([_question, _plan]) => {
                this.notificationService.isProcessing(false);
                if (!this.selectPlan) return;

                if (_question && _question.data) {
                    const datCount = _question.data.filter((m: any) => m.status === 1).length;
                    this.selectPlan.has_form_test = true;
                    this.selectPlan.has_question = `${datCount}/${_question.data.length}`;
                    this.selectPlan._question_dat = datCount;
                } else {
                    this.selectPlan.has_form_test = false;
                }

                this.selectPlan.has_test = Boolean(_plan.data && _plan.data.length);
            },
            error: () => {
                this.notificationService.isProcessing(false);
            }
        });
    }

    async sinhDeByKynang(row: PlanWithMeta): Promise<void> {
        if (!this.selectedCourse) return;
        const confirm = await firstValueFrom(
            this.notificationService.confirmDelete2({
                heading: 'Xác nhận hành động',
                htmlMessage: `Thầy/Cô có chắc chắn muốn sinh đề ${row.title}?`
            })
        );

        if (confirm) {
            const data: SINHDETX = {
                course_id: this.selectedCourse.id,
                ordering: row.ordering,
                limit: this.number_test_config['TX_TEST'] || 1
            };

            this.saving.set(true);
            this.notificationService.isProcessing(true);

            this.courseFormTxService.sinhde(data).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.loadTestTracnghiem();
                    this.notificationService.toastInfo('Đã sinh đề xong, vui lòng kiểm tra');
                },
                error: () => {
                    this.saving.set(false);
                    this.notificationService.isProcessing(false);
                    this.notificationService.toastError('Sinh đề thất bại, vui lòng thử lại');
                }
            });
        }
    }

    async deleteDeKynang(row: PlanWithMeta): Promise<void> {
        if (!this.selectedCourse) return;
        const confirm = await firstValueFrom(this.notificationService.confirmDelete(1));
        if (confirm) {
            this.saving.set(true);
            this.notificationService.isProcessing(true);
            const condition_plan_bank: ConditionOption = {
                condition: [
                    { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                    { conditionName: 'bank_type', condition: IctuQueryCondition.equal, value: 'TX', orWhere: 'and' },
                    { conditionName: 'week', condition: IctuQueryCondition.equal, value: '100', orWhere: 'and' },
                    { conditionName: 'ordering', condition: IctuQueryCondition.equal, value: row.ordering.toString(), orWhere: 'and' },
                ],
                set: [
                    { label: 'limit', value: '-1' },
                    { label: 'select', value: 'id' },
                ],
                page: null
            };

            this.coursePlanBankService.getCoursePlanBankByPageNew(condition_plan_bank).pipe(
                mergeMap(_test => {
                    const ids = (_test.data || []).map(m => m.id);
                    if (ids.length) {
                        return this.coursePlanBankService.deleteCoursePlanBank(ids.toString());
                    }
                    return of(null);
                })
            ).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.notificationService.toastSuccess('Xóa thành công');
                    this.loadTestTracnghiem();
                },
                error: () => {
                    this.saving.set(false);
                    this.notificationService.isProcessing(false);
                    this.notificationService.toastError('Xóa thất bại');
                }
            });
        }
    }
}
