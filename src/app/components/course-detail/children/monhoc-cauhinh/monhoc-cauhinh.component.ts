import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { Course } from '@models/course';
import { CoursePlanActivities } from '@models/dtkh/course-plan-activities';
import { CourseConfig } from '@models/dtkh/course-config';
import { SystemConfig } from '@models/system-config';
import { ConditionOption } from '@models/condition-option';
import { IctuQueryCondition } from '@models/dto';
import { AppState } from '@models/app-state';
import { CourseService } from '@services/course.service';
import { CoursePlanActivitiesService } from '@services/course-plan-activities.service';
import { CourseConfigService } from '@services/course-config.service';
import { SysConfigsService } from '@services/sys-configs.service';
import { AuthenticationService } from '@services/authentication.service';
import { NotificationService } from '@services/notification.service';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface TestTypeOption {
    id: string;
    key: string;
    label: string;
}

const DEFAULT_TEST_TYPES: TestTypeOption[] = [
    { id: 'et_1', key: 'THUONGXUYEN_TRACNGHIEM', label: 'Trắc nghiệm' },
    { id: 'et_2', key: 'THUONGXUYEN_TULUAN', label: 'Thực hành' },
    { id: 'et_3', key: 'THUONGXUYEN_TULUAN', label: 'Tự Luận' },
    { id: 'et_4', key: 'THUONGXUYEN_TULUAN', label: 'Vấn đáp' },
    { id: 'et_5', key: 'THUONGXUYEN_TULUAN', label: 'Vẽ' },
    { id: 'et_7', key: 'THUONGXUYEN_DUAN', label: 'Dự án' },
    { id: 'et_8', key: 'THUONGXUYEN_DUAN', label: 'Báo cáo' },
    { id: 'et_9', key: 'THUONGXUYEN_DUAN', label: 'Tiểu luận' }
];

@Component({
    selector: 'app-monhoc-cauhinh',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PanelModule,
        TableModule,
        Select,
        InputText,
        MatButtonModule,
        MatTooltipModule,
        LoadingProgressComponent
    ],
    templateUrl: './monhoc-cauhinh.component.html',
    styleUrl: './monhoc-cauhinh.component.css'
})
export class MonhocCauhinhComponent implements OnInit {
    /** Môn học được truyền từ component cha (course-detail). */
    readonly course = input<Course | null>(null);

    /** Id môn học. */
    readonly courseId = input<number>(0);

    /** Trạng thái tải trang: 'loading' | 'error' | 'success'. */
    readonly state: WritableSignal<AppState> = signal<AppState>('loading');

    /** Trạng thái đang lưu dữ liệu. */
    readonly saving = signal<boolean>(false);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly courseService = inject(CourseService);
    private readonly coursePlanActivitiesService = inject(CoursePlanActivitiesService);
    private readonly courseConfigService = inject(CourseConfigService);
    private readonly configsService = inject(SysConfigsService);
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
    indexByKeyServerInSotinchi: number | null = null;
    plan_kiemtra: CoursePlanActivities | null = null;
    readonly THUONGXUYEN_TEST_TYPE = DEFAULT_TEST_TYPES;
    list_config: SystemConfig[] = [];
    list_plan: CoursePlanActivities[] = [];
    isOpenSettingDate = false;
    course_config_object: Record<string, CourseConfig[]> = {};
    readonly isDttx = false;

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

    private loadCourseData(id: number, suppliedCourse?: Course): void {
        this.loadedCourseId = id;
        this.state.set('loading');
        this.notificationService.isProcessing(true);

        const course$ = suppliedCourse ? of(suppliedCourse) : this.courseService.getCourseById(id);

        const condition_plan: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: id.toString(), orWhere: 'and' },
                { conditionName: 'week', condition: IctuQueryCondition.lessThan, value: '100', orWhere: 'and' },
                { conditionName: 'week', condition: IctuQueryCondition.greaterThan, value: '0', orWhere: 'and' },
                { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-3', orWhere: 'and' },
                { conditionName: 'type', condition: IctuQueryCondition.equal, value: 'PLAN', orWhere: 'and' },
                { conditionName: 'parent_id', condition: IctuQueryCondition.equal, value: '0', orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'order', value: 'ASC' },
                { label: 'orderby', value: 'ordering' },
                { label: 'select', value: 'week' }
            ],
            page: null
        };

        const condition_config: ConditionOption = {
            condition: [],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'include_by', value: 'config_key' },
                { label: 'include', value: 'PERCENT_SCORE_SUMMARY,PERCENT_OF_LEAVE_ALLOWED,NUMOF_TEST_CCTX,PRACTICE_TIME_FOR_A_TEST' }
            ],
            page: null
        };

        const condition_course_config: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: id.toString(), orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'order', value: 'ASC' },
                { label: 'orderby', value: 'ordering' }
            ],
            page: null
        };

        forkJoin({
            course: course$,
            plans: this.coursePlanActivitiesService.getCoursePlanActivitiesByPageNew(condition_plan),
            configs: this.configsService.getConfigsByPageNew(condition_config),
            courseConfigs: this.courseConfigService.getCourseConfigByPageNew(condition_course_config)
        }).subscribe({
            next: ({ course, plans, configs, courseConfigs }) => {
                if (course && course.id) {
                    this.selectedCourse = course;
                    const sotinchi = course.params?.sotinchi ?? course.sotinchi ?? 0;
                    this.indexByKeyServerInSotinchi = sotinchi;

                    if (this.routerDaotao || this.routerLanhdaobomon || this.routerLanhdaokhoa || this.userId === course.creator_plan_id) {
                        this.canAdded = true;
                    } else {
                        this.canAdded = false;
                    }

                    this.list_config = configs.data || [];
                    this.list_plan = plans.data || [];

                    this.convertDataCourseConfig(courseConfigs.data || []);
                    this.loadKiemtrathuongxuyen(id);
                } else {
                    this.notificationService.toastError('Không tìm thấy môn học');
                    this.state.set('error');
                    this.notificationService.isProcessing(false);
                }
            },
            error: () => {
                this.notificationService.toastError('Lỗi kết nối, vui lòng thử lại');
                this.state.set('error');
                this.notificationService.isProcessing(false);
            }
        });
    }

    loadKiemtrathuongxuyen(courseId: number): void {
        const condition_test: ConditionOption = {
            condition: [
                { conditionName: 'week', condition: IctuQueryCondition.equal, value: '1000', orWhere: 'and' },
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId.toString(), orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'order', value: 'ASC' },
                { label: 'orderby', value: 'ordering' }
            ],
            page: null
        };

        this.coursePlanActivitiesService.getCoursePlanActivitiesByPageNew(condition_test).subscribe({
            next: (_course_plan) => {
                const parent = (_course_plan.data || []).find(m => m.parent_id === 0);

                if (parent) {
                    parent.children = (_course_plan.data || []).filter(m => m.parent_id === parent.id);
                    this.plan_kiemtra = parent;
                } else {
                    const title = this.isDttx ? 'Kiểm tra giữa kỳ' : 'Kiểm tra thường xuyên';

                    const _plan_kiemtra: CoursePlanActivities = {
                        course_id: courseId,
                        week: 1000,
                        title: title,
                        desc: '',
                        video: null,
                        files: null,
                        ordering: 1000,
                        status: 1,
                        course_lesson_id: 0,
                        parent_id: 0,
                        type: 'PLAN',
                        desc_title: '',
                        edit: 1,
                        slides: null,
                        children: [],
                        exam_type: this.selectedCourse?.params?.exam_type as any
                    };

                    this.plan_kiemtra = _plan_kiemtra;
                }

                this.createTestTx();
                this.state.set('success');
                this.notificationService.isProcessing(false);
            },
            error: () => {
                this.state.set('error');
                this.notificationService.isProcessing(false);
            }
        });
    }

    onChangeTypeTest(examId: string, test: CoursePlanActivities): void {
        const found = this.THUONGXUYEN_TEST_TYPE.find(m => m.id === examId);
        if (found) {
            test.type = found.key as any;
            test.exam_type = found.id;
        }
    }

    addTestTx(): void {
        if (!this.selectedCourse || !this.plan_kiemtra) return;

        let type = 'THUONGXUYEN_TRACNGHIEM';
        switch (this.selectedCourse.params?.exam_format) {
            case 'DUAN':
                type = 'THUONGXUYEN_DUAN';
                break;
            case 'THUCHANH':
                type = 'THUONGXUYEN_TULUAN';
                break;
            case 'TRACNGHIEM':
                type = 'THUONGXUYEN_TRACNGHIEM';
                break;
        }

        if (this.plan_kiemtra.children) {
            const data_length = this.plan_kiemtra.children.filter(m => m.ordering > 0 && m.ordering < 100);
            const ordering = data_length.length + 1;

            let title = `Bài kiểm tra thường xuyên ${ordering}`;
            if (this.isDttx) {
                title = `Bài kiểm tra giữa kỳ số ${ordering}`;
            }

            const child: CoursePlanActivities = {
                course_id: this.selectedCourse.id,
                week: 1000,
                title: title,
                desc: '',
                video: null,
                files: null,
                ordering: ordering,
                status: 1,
                course_lesson_id: 0,
                parent_id: this.plan_kiemtra.id || 0,
                type: type as any,
                desc_title: '',
                edit: 1,
                slides: null,
                exam_type: this.selectedCourse.params?.exam_type as any
            };

            const index = this.plan_kiemtra.children.findIndex(m => m.ordering === ordering - 1);
            if (index !== -1) {
                this.plan_kiemtra.children.splice(index + 1, 0, child);
            } else {
                this.plan_kiemtra.children.push(child);
            }

            if (this.selectedCourse.params?.exam_format === 'DUAN') {
                this.plan_kiemtra.children = this.addDuan(this.plan_kiemtra.children, type);
            }
        }
    }

    createTestTx(): void {
        if (!this.selectedCourse || !this.plan_kiemtra) return;

        let type = 'THUONGXUYEN_TRACNGHIEM';
        switch (this.selectedCourse.params?.exam_format) {
            case 'DUAN':
                type = 'THUONGXUYEN_DUAN';
                break;
            case 'THUCHANH':
                type = 'THUONGXUYEN_TULUAN';
                break;
            case 'TRACNGHIEM':
                type = 'THUONGXUYEN_TRACNGHIEM';
                break;
        }

        const sotinchi = this.selectedCourse.params?.sotinchi ?? this.selectedCourse.sotinchi;
        if (sotinchi) {
            const maxTest = sotinchi;
            if (this.plan_kiemtra.children && this.plan_kiemtra.children.length === 0) {
                while (this.plan_kiemtra.children.filter(m => m.ordering > 0 && m.ordering < 100).length < maxTest) {
                    this.addTestTx();
                }
            }

            let childs: CoursePlanActivities[] = this.plan_kiemtra.children || [];
            if (this.selectedCourse.params?.exam_format === 'DUAN') {
                childs = this.addDuan(childs, type);
            }
            this.plan_kiemtra.children = childs;
        } else {
            this.notificationService.toastWarning('Môn học này chưa được cài đặt số tín chỉ');
        }
    }

    addDuan(data: CoursePlanActivities[], type: string): CoursePlanActivities[] {
        if (!this.selectedCourse || !this.plan_kiemtra) return data;

        const index_0 = data.findIndex(m => m.ordering === 0);
        if (index_0 === -1) {
            const test: CoursePlanActivities = {
                course_id: this.selectedCourse.id,
                week: 1000,
                title: 'Danh sách dự án',
                desc: '',
                video: null,
                files: null,
                ordering: 0,
                status: 1,
                course_lesson_id: 0,
                parent_id: this.plan_kiemtra.id || 0,
                type: type as any,
                desc_title: '',
                edit: 1,
                slides: null,
                exam_type: this.selectedCourse.params?.exam_type as any
            };
            data.splice(0, 0, test);
        }

        const index_100 = data.findIndex(m => m.ordering === 100);
        if (index_100 === -1) {
            const test: CoursePlanActivities = {
                course_id: this.selectedCourse.id,
                week: 1000,
                title: 'Thi kết thúc học phần',
                desc: '',
                video: null,
                files: null,
                ordering: 100,
                status: 1,
                course_lesson_id: 0,
                parent_id: this.plan_kiemtra.id || 0,
                type: type as any,
                desc_title: '',
                edit: 1,
                slides: null,
                exam_type: this.selectedCourse.params?.exam_type as any
            };
            data.push(test);
        }

        return data;
    }

    async deleteItemKynang(item: CoursePlanActivities, index: number): Promise<void> {
        if (!this.plan_kiemtra?.children) return;

        if (!item.id) {
            this.plan_kiemtra.children.splice(index, 1);
        } else {
            const confirm = await firstValueFrom(this.notificationService.confirmDelete(1));
            if (confirm) {
                this.notificationService.isProcessing(true);
                this.coursePlanActivitiesService.deleteCoursePlanActivities(item.id).subscribe({
                    next: () => {
                        if (this.selectedCourse?.id) {
                            this.loadKiemtrathuongxuyen(this.selectedCourse.id);
                        }
                        this.notificationService.toastSuccess('Thao tác thành công');
                    },
                    error: () => {
                        this.notificationService.isProcessing(false);
                        this.notificationService.toastError('Thao tác không thành công');
                    }
                });
            }
        }
    }

    async saveTestKynang(): Promise<void> {
        if (!this.selectedCourse || !this.plan_kiemtra) return;

        this.saving.set(true);
        this.notificationService.isProcessing(true);

        const request: Observable<any>[] = [];

        if (!this.plan_kiemtra.id) {
            const data_parent = { ...this.plan_kiemtra };
            delete data_parent.children;
            this.plan_kiemtra.id = await firstValueFrom(this.coursePlanActivitiesService.addCoursePlanActivities(data_parent));
        }

        if (this.plan_kiemtra.children && this.plan_kiemtra.children.length) {
            if (this.plan_kiemtra.children.filter(m => m.ordering > 0).length > 4) {
                this.saving.set(false);
                this.notificationService.isProcessing(false);
                this.notificationService.toastWarning('Số lượng bài kiểm tra tối đa là 4');
                return;
            }

            if (this.plan_kiemtra.children.filter(m => !m.type).length) {
                this.saving.set(false);
                this.notificationService.isProcessing(false);
                this.notificationService.toastWarning('Vui lòng chọn loại kiểm tra');
                return;
            }

            this.plan_kiemtra.children.forEach(f => {
                f.parent_id = this.plan_kiemtra!.id || 0;
                const id = f.id;
                delete f.disabled_type;
                if (f.id) {
                    const payload = { ...f };
                    delete payload.id;
                    request.push(this.coursePlanActivitiesService.updateCoursePlanActivities(id!, payload));
                } else {
                    request.push(this.coursePlanActivitiesService.addCoursePlanActivities(f));
                }
            });
        }

        if (request.length) {
            forkJoin(request).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.notificationService.toastSuccess('Thao tác thành công');
                    this.loadKiemtrathuongxuyen(this.selectedCourse!.id);
                },
                error: () => {
                    this.saving.set(false);
                    this.notificationService.toastError('Lưu thất bại');
                    this.notificationService.isProcessing(false);
                }
            });
        } else {
            this.saving.set(false);
            this.notificationService.isProcessing(false);
        }
    }

    canEditTest(test: CoursePlanActivities): boolean {
        return (!test.id && test.ordering !== 0 && test.ordering !== 100) ||
            this.isManager || this.routerDaotao || this.routerLanhdaokhoa;
    }

    checkDeletePlan(ordering: number): boolean {
        if (this.plan_kiemtra?.children && this.plan_kiemtra.children.length) {
            const data = this.plan_kiemtra.children.filter(m => m.ordering > 0 && m.ordering < 100);
            return ordering === data.length;
        }
        return false;
    }

    loadConfig(courseId: number): void {
        this.notificationService.isProcessing(true);
        const condition_course_config: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId.toString(), orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'order', value: 'ASC' },
                { label: 'orderby', value: 'ordering' }
            ],
            page: null
        };
        this.courseConfigService.getCourseConfigByPageNew(condition_course_config).subscribe({
            next: (_course_config) => {
                this.convertDataCourseConfig(_course_config.data || []);
                this.notificationService.isProcessing(false);
            },
            error: () => {
                this.notificationService.isProcessing(false);
            }
        });
    }

    openSettingDateByWeek(): void {
        this.isOpenSettingDate = !this.isOpenSettingDate;
    }

    convertDataCourseConfig(_course_config: CourseConfig[]): void {
        if (!this.selectedCourse) return;

        this.course_config_object = {};
        const tmp_object: Record<string, CourseConfig[]> = {};

        if (_course_config && _course_config.length) {
            _course_config.forEach(f => {
                if (!tmp_object[f.group]) {
                    tmp_object[f.group] = [];
                }
                tmp_object[f.group].push(f);
            });
        } else {
            this.list_config.forEach(f => {
                if (!tmp_object[f.config_key]) {
                    tmp_object[f.config_key] = [];
                    const tmp_percent: CourseConfig[] = [];
                    switch (f.config_key) {
                        case 'PERCENT_SCORE_SUMMARY':
                            if (f.params) {
                                Object.keys(f.params).forEach((o, key) => {
                                    let title = '';
                                    if (o === 'cc') {
                                        title = 'Điểm chuyên cần';
                                    } else if (o === 'daugio') {
                                        title = 'Kiểm tra 15 phút';
                                    } else if (o === 'kynang') {
                                        title = this.isDttx ? 'Kiểm tra giữa kỳ' : 'Kiểm tra thường xuyên';
                                    } else if (o === 'bttn') {
                                        title = 'Luyện tập tại nhà';
                                    }

                                    tmp_percent.push({
                                        course_id: this.selectedCourse!.id,
                                        group: f.config_key,
                                        key: o,
                                        title: title,
                                        ordering: key + 1,
                                        value: f.params[o]
                                    });
                                });
                            }

                            tmp_percent.push({
                                course_id: this.selectedCourse!.id,
                                group: f.config_key,
                                key: 'thi',
                                title: 'Kiểm tra kết thúc học phần',
                                ordering: 4,
                                value: 50
                            });
                            break;

                        case 'NUMOF_TEST_CCTX':
                            if (f.params) {
                                Object.keys(f.params).forEach((o, key) => {
                                    let title = '';
                                    if (o === 'CC_TEST') {
                                        title = this.isDttx ? 'Luyện tập tại nhà' : 'Luyện tập tại nhà & Kiểm tra 15 phút';
                                    } else if (o === 'TX_TEST') {
                                        title = this.isDttx ? 'Kiểm tra giữa kỳ' : 'Kiểm tra thường xuyên';
                                    }

                                    tmp_percent.push({
                                        course_id: this.selectedCourse!.id,
                                        group: f.config_key,
                                        key: o,
                                        title: title,
                                        ordering: key + 1,
                                        value: f.params[o]
                                    });
                                });
                            }
                            break;

                        case 'PRACTICE_TIME_FOR_A_TEST':
                            tmp_percent.push({
                                course_id: this.selectedCourse!.id,
                                group: f.config_key,
                                key: 'DEFAULT',
                                title: 'Thời hạn làm bài tính theo ngày (mặc định)',
                                ordering: 0,
                                value: f.value
                            });

                            const params_date: Record<string, any> = {};
                            this.list_plan.forEach(p => {
                                params_date[p.week] = f.value;
                            });

                            tmp_percent.push(
                                {
                                    course_id: this.selectedCourse!.id,
                                    group: f.config_key,
                                    key: 'EXCEPT',
                                    title: 'Thời hạn theo từng bài (ngày)',
                                    ordering: 1,
                                    value: 0,
                                    params: params_date
                                },
                                {
                                    course_id: this.selectedCourse!.id,
                                    group: f.config_key,
                                    key: 'NUMOF_EXTDATE_FORTEST',
                                    title: 'Tối đa số ngày cho phép gia hạn',
                                    ordering: 100,
                                    value: 7
                                },
                                {
                                    course_id: this.selectedCourse!.id,
                                    group: f.config_key,
                                    key: 'TIME_OF_TEST',
                                    title: 'Thời gian làm bài luyện tập (phút)',
                                    ordering: 200,
                                    value: 15
                                }
                            );
                            break;

                        case 'PERCENT_OF_LEAVE_ALLOWED':
                            tmp_percent.push({
                                course_id: this.selectedCourse!.id,
                                group: f.config_key,
                                key: 'DEFAULT',
                                title: 'Số ngày sinh viên được phép nghỉ (%)',
                                ordering: 1,
                                value: f.value
                            });
                            break;

                        default:
                            break;
                    }
                    tmp_object[f.config_key] = tmp_percent;
                }
            });
        }
        this.course_config_object = tmp_object;
    }

    saveCourseConfig(): void {
        const request: Observable<any>[] = [];
        Object.keys(this.course_config_object).forEach(o => {
            if (Array.isArray(this.course_config_object[o])) {
                this.course_config_object[o].forEach(f => {
                    if (f.id) {
                        const tmp_id = f.id;
                        const data = { ...f };
                        delete data.id;
                        request.push(this.courseConfigService.updateCourseConfig(tmp_id, data));
                    } else {
                        const data = { ...f };
                        request.push(this.courseConfigService.addCourseConfig(data));
                    }
                });
            }
        });

        if (request.length) {
            this.saving.set(true);
            this.notificationService.isProcessing(true);
            forkJoin(request).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.notificationService.toastSuccess('Cập nhật thành công');
                    if (this.selectedCourse?.id) {
                        this.loadConfig(this.selectedCourse.id);
                    }
                },
                error: () => {
                    this.saving.set(false);
                    this.notificationService.isProcessing(false);
                    this.notificationService.toastError('Cập nhật thất bại');
                }
            });
        }
    }

    pointQuestionKeyDown(event: KeyboardEvent): void {
        if (event) {
            if (/[0-9]/.test(event.key) || event.key === 'Backspace' || event.key === 'Tab' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                // Allowed
            } else {
                event.preventDefault();
            }
        }
    }

    onChangeValueInput(item: CourseConfig): void {
        if (item.key === 'DEFAULT') {
            const list = this.course_config_object['PRACTICE_TIME_FOR_A_TEST'];
            if (list) {
                const exceptItem = list.find(m => m.key === 'EXCEPT');
                if (exceptItem?.params) {
                    Object.keys(exceptItem.params).forEach(f => {
                        exceptItem.params[f] = item.value;
                    });
                }
            }
        }
    }
}
