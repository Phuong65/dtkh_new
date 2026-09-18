import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { firstValueFrom, forkJoin } from 'rxjs';
import { AuthenticationService } from '@services/authentication.service';
import { NotificationService } from '@services/notification.service';
import { CoursePlanActivitiesService } from '@services/course-plan-activities.service';
import { CoursePlanCommentService } from '@services/course-plan-comment.service';
import { CourseQuestionsService } from '@services/course-questions.service';
import { ConditionOption } from '@models/condition-option';
import { CoursePlanActivities } from '@models/dtkh/course-plan-activities';
import { CoursePlanComment } from '@models/dtkh/course-plan-comment';
import { Course } from '@models/course';
import { IctuQueryCondition } from '@models/dto';
import { Helper } from '@utilities/helper';
import { NhanxetNoidungComponent } from '../nhanxet-noidung/nhanxet-noidung.component';
import { Date2textPipe } from '@pipes/date2text.pipe';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';

const OvicQueryCondition = IctuQueryCondition;

export const CHUAN_DAU_RA = [
    { id: 1, label: 'Biết', disabled: false, isActive: true },
    { id: 2, label: 'Hiểu', disabled: false, isActive: false },
    { id: 3, label: 'Vận dụng', disabled: false, isActive: false },
    { id: 4, label: 'Phân tích', disabled: false, isActive: false },
    { id: 5, label: 'Đánh giá', disabled: false, isActive: false },
    { id: 6, label: 'Sáng tạo', disabled: false, isActive: false }
];

export const PHUONGPHAP_DANGDAY = [];

@Component({
    selector: 'app-chuandaura',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        PanelModule,
        ButtonModule,
        MultiSelectModule,
        NhanxetNoidungComponent,
        Date2textPipe,
        SafeHtmlPipe
    ],
    templateUrl: './chuandaura.component.html',
    styleUrls: ['./chuandaura.component.css']
})
export class ChuandauraComponent implements OnInit, OnChanges {

    @Input() coursePlanActivities: CoursePlanActivities;

    @Input() courses: Course;

    @Input() canAdded: boolean = false;

    @ViewChild('panelplan_add') panelplan_add: ElementRef;

    @ViewChild('layoutChuandaura') layoutChuandaura: ElementRef;

    @ViewChild(NhanxetNoidungComponent) nhanxetnoidung: NhanxetNoidungComponent;

    formCDR: FormGroup;

    PHUONGPHAP_DANGDAY = [
        { id: 1, label: 'Thuyết trình' },
        { id: 2, label: 'Vấn đáp' },
        { id: 3, label: 'Thảo luận nhóm' },
        { id: 4, label: 'Thực hành' },
        { id: 5, label: 'Tự học' }
    ];

    CHUAN_DAU_RA = CHUAN_DAU_RA;

    isOpenAddForm = false;

    selectedCourse: Course;

    selectedCoursePlanActivities: CoursePlanActivities;

    listCDR: CoursePlanActivities[] = [];

    isUpdated = false;

    selectCdr: CoursePlanActivities;

    OPTION_THOILUONG = [
        { id: 1, label: '1 Tiết' },
        { id: 2, label: '2 Tiết' },
        { id: 3, label: '3 Tiết' },
        { id: 4, label: '4 Tiết' },
        { id: 5, label: '5 Tiết' }
    ];

    selectedComment: CoursePlanComment;

    userId: number;

    @Output() onSaveCdr = new EventEmitter<any>();

    constructor(
        public formBuilder: FormBuilder,
        private coursePlanActivitiesService: CoursePlanActivitiesService,
        private noitifi: NotificationService,
        private router: Router,
        private coursePlanCommentService: CoursePlanCommentService,
        private auth: AuthenticationService,
        private courseQuestionsService: CourseQuestionsService
    ) {
        this.userId = this.auth.user?.id || 0;
        this.formCDR = this.formBuilder.group(
            {
                title: ['', Validators.required],
                type: [''],
                course_id: [''],
                parent_id: [''],
                week: [''],
                desc: [''],
                ordering: [''],
                time_learning: ['', Validators.required],
                method: ['', Validators.required],
                level_require: ['', Validators.required],
                kyhieu: ['', Validators.required],
                desc_title: ['', Validators.required],
                desc_cpi: ['', Validators.required]
            }
        );
    }

    ngOnInit(): void {
        if (this.coursePlanActivities) {
            this.selectedCoursePlanActivities = this.coursePlanActivities;
        }

        if (this.courses) {
            this.selectedCourse = this.courses;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['courses']) {
            this.selectedCourse = this.courses;
        }

        if (changes['coursePlanActivities']) {
            this.selectedCoursePlanActivities = this.coursePlanActivities;
            this.isOpenAddForm = false;
            this.loadCdr();
        }
    }

    loadCdr() {
        this.selectCdr = null;
        this.noitifi.isProcessing(true);
        const condition: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: OvicQueryCondition.equal, value: this.selectedCourse.id.toString() },
                { conditionName: 'type', condition: OvicQueryCondition.equal, value: 'ACTIVITY_CDR', orWhere: 'and' },
                { conditionName: 'parent_id', condition: OvicQueryCondition.equal, value: this.coursePlanActivities.id.toString(), orWhere: 'and' },
                { conditionName: 'status', condition: OvicQueryCondition.notEqual, value: '-3', orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'order', value: 'ASC' },
            ],
            page: null
        };

        const condition_comment: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: OvicQueryCondition.equal, value: this.selectedCourse.id.toString() },
                { conditionName: 'parent_id', condition: OvicQueryCondition.equal, value: '0', orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' },
            ],
            page: null
        };

        const condition_reply_comment: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: OvicQueryCondition.equal, value: this.selectedCourse.id.toString() },
                { conditionName: 'parent_id', condition: OvicQueryCondition.notEqual, value: '0', orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'select', value: 'id, parent_id' }
            ],
            page: null
        };

        forkJoin([
            this.coursePlanActivitiesService.getCoursePlanActivitiesByPageNew(condition),
            this.coursePlanCommentService.getCoursePlanCommentByPageNew(condition_comment),
            this.coursePlanCommentService.getCoursePlanCommentByPageNew(condition_reply_comment),
        ]).subscribe({
            next: ([_cdr, _comment, _comment_child]) => {
                const cdrList = _cdr && Array.isArray(_cdr.data) ? _cdr.data : [];
                const commentsList = _comment && Array.isArray(_comment.data) ? _comment.data : [] as CoursePlanComment[];
                const replyCommentsList = _comment_child && Array.isArray(_comment_child.data) ? _comment_child.data : [] as CoursePlanComment[];

                cdrList.forEach(f => {
                    f['open'] = false;
                    if (f.params && f.params.cdr && f.params.cdr.cdr_info) {
                        f.params.cdr.cdr_info.forEach(c => {
                            f[c.id] = c.value;
                        });
                    }
                    f['stt'] = f['kyhieu'] ? f['kyhieu'].replace(/\D/g, '') : '';

                    const comments = commentsList.filter(m => m.course_plan_activity_id === f.id || (m.course_plan_activity_id === f.course_plan_activity_id && f.course_plan_activity_id !== 0));

                    const object_comment: Record<string, any[]> = {};

                    comments.forEach(t => {
                        const count_reply = replyCommentsList.filter(m => m.parent_id === t.id).length;
                        t['count_reply'] = count_reply;

                        if (!object_comment[t.user_id]) {
                            object_comment[t.user_id] = [];
                            object_comment[t.user_id].push(t);
                        } else {
                            object_comment[t.user_id].push(t);
                        }
                    });

                    f['comments'] = [];

                    Object.keys(object_comment).forEach(o => {
                        f['comments'].push({ user_id: o, children: object_comment[o] });
                    });

                    if (f.params?.cdr && Array.isArray(f.params.cdr.cdr_info)) {
                        f.params.cdr.cdr_info.forEach(c => {
                            if (c.id === 'level_require') c['tt'] = 1;
                            if (c.id === 'time_learning') c['tt'] = 2;
                            if (c.id === 'method') c['tt'] = 3;
                        });
                        f.params.cdr.cdr_info = Helper.arraySort(f.params.cdr.cdr_info, 'tt' as any);
                    }
                });

                this.listCDR = Helper.arraySort(cdrList, 'kyhieu' as any);
                this.clearFormData();
                this.noitifi.isProcessing(false);
            },
            error: () => {
                this.noitifi.isProcessing(false);
            }
        });
    }

    get fcdr() {
        return this.formCDR.controls;
    }

    onOpenAddCdr() {
        this.isOpenAddForm = !this.isOpenAddForm;
        this.clearFormData();
        if (this.selectCdr) {
            this.selectCdr['open'] = false;
        }
        this.selectCdr = null;
        if (this.panelplan_add) {
            this.panelplan_add['animating'] = true;
        }
        if (this.layoutChuandaura?.nativeElement) {
            this.layoutChuandaura.nativeElement.scrollTop = 0;
        }
    }

    onOpenEditCdr(panelplan, panelplan_bottom, cdr) {
        this.listCDR.forEach(f => {
            if (f.id !== cdr.id) {
                f['open'] = false;
            }
        });

        panelplan['animating'] = true;
        panelplan_bottom['animating'] = true;
        this.isOpenAddForm = false;
        cdr['open'] = !cdr['open'];
        this.editCdr(cdr);
    }

    editCdr(cdr) {
        this.selectCdr = cdr;
        this.clearFormData();
        const kyhieu = cdr.kyhieu ? cdr.kyhieu.split(" ")[1] : '';
        const last_mode = kyhieu ? kyhieu.split('.')[1] : '';
        this.fcdr['kyhieu'].setValue(last_mode);
        this.fcdr['title'].setValue(cdr.title);
        this.fcdr['desc'].setValue(cdr.desc);
        this.fcdr['desc_title'].setValue(cdr.desc_title);
        this.fcdr['desc_cpi'].setValue(cdr.desc_cpi);
        if (cdr.params && cdr.params.cdr && cdr.params.cdr.cdr_info) {
            const ar = ['time_learning', 'method', 'level_require'];
            ar.forEach(f => {
                const index = cdr.params.cdr.cdr_info.findIndex(m => m.id === f);
                if (index !== -1) {
                    this.fcdr[f].setValue(cdr.params.cdr.cdr_info[index].key);
                }
            });
        }

        this.isUpdated = true;
    }

    clearFormData() {
        this.formCDR.reset();
        let ordering = 1;
        if (this.listCDR.length) {
            ordering = this.listCDR[this.listCDR.length - 1].ordering + 1;
            const kyhieu = this.listCDR[this.listCDR.length - 1].kyhieu ? this.listCDR[this.listCDR.length - 1].kyhieu.split(".")[1] : ordering;
            const kyhieu_next = !isNaN(Number(kyhieu)) ? kyhieu : ordering;
            this.fcdr['kyhieu'].setValue(Number(kyhieu_next) + 1);
        } else {
            this.fcdr['kyhieu'].setValue(ordering);
        }

        this.fcdr['course_id'].setValue(this.selectedCourse.id);
        this.fcdr['parent_id'].setValue(this.selectedCoursePlanActivities.id);
        this.fcdr['type'].setValue('ACTIVITY_CDR');
        this.fcdr['week'].setValue(this.selectedCoursePlanActivities.week);
        this.fcdr['ordering'].setValue(ordering);
        this.isUpdated = false;
    }

    checkKyhieuCdrPromise(data): Promise<boolean> {
        if (data) {
            return new Promise((resolve, reject) => {
                const condition: ConditionOption = {
                    condition: [
                        { conditionName: 'kyhieu', condition: OvicQueryCondition.equal, value: data['kyhieu'], orWhere: 'and' },
                        { conditionName: 'course_id', condition: OvicQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                        { conditionName: 'type', condition: OvicQueryCondition.equal, value: 'ACTIVITY_CDR', orWhere: 'and' },
                        { conditionName: 'status', condition: OvicQueryCondition.notEqual, value: '-3', orWhere: 'and' }
                    ],
                    set: [
                        { label: 'limit', value: '1' }
                    ],
                    page: null
                };

                if (this.isUpdated) {
                    condition.condition.push({ conditionName: 'id', condition: OvicQueryCondition.notEqual, value: this.selectCdr.id.toString(), orWhere: 'and' });
                }

                this.coursePlanActivitiesService.getCoursePlanActivitiesByPageNew(condition).subscribe({
                    next: (_res) => {
                        if (_res.recordsFiltered) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    },
                    error: () => {
                        reject(false);
                    }
                });
            });
        }
        return Promise.resolve(false);
    }

    async saveCdr() {
        if (this.formCDR.valid) {
            const data = { ...this.formCDR.getRawValue() };

            if (data['time_learning'] === 5 && data['method'] && data['method'].length < 2) {
                return this.noitifi.toastWarning("Với CPI có thời lượng là 5 tiết, vui lòng chọn 2 phương pháp giảng dạy trở lên");
            }

            const method: string[] = [];
            if (Array.isArray(data['method'])) {
                data['method'].forEach((f) => {
                    method.push(f.label || f);
                });
            }

            const index_level = CHUAN_DAU_RA.findIndex(m => m.id === data['level_require']);

            data['params'] = {
                cdr: {
                    cdr_info: [
                        { label: 'Thời lượng', value: data['time_learning'].toString().concat(' tiết'), id: 'time_learning', key: data['time_learning'] },
                        { label: 'Phương pháp', value: method.join(', '), key: data['method'], id: 'method' },
                        { label: 'Mức độ yêu cầu', value: index_level !== -1 ? CHUAN_DAU_RA[index_level].label : 'Chưa chọn mức độ yêu cầu', key: data['level_require'], id: 'level_require' },
                    ]
                }
            };

            const ar_delete = ['time_learning', 'method', 'level_require', 'number_question'];
            data['kyhieu'] = 'CPI '.concat(this.selectedCoursePlanActivities.week.toString(), '.', data['kyhieu']);
            ar_delete.forEach(f => {
                delete data[f];
            });

            this.noitifi.isProcessing(true);

            const checkKyhieu = await this.checkKyhieuCdrPromise(data);

            if (!checkKyhieu) {
                this.noitifi.isProcessing(false);
                return this.noitifi.toastWarning('Ký hiệu bị trùng, vui lòng nhập lại ký hiệu');
            }

            if (this.isUpdated) {
                if (this.selectCdr['status'] === -1) {
                    const data_copy: CoursePlanActivities = {
                        course_id: this.selectCdr.course_id,
                        course_lesson_id: this.selectCdr.course_lesson_id,
                        desc: this.selectCdr.desc,
                        files: this.selectCdr.files,
                        ordering: this.selectCdr.ordering,
                        params: this.selectCdr.params,
                        parent_id: this.selectCdr.parent_id,
                        slides: this.selectCdr.slides,
                        title: this.selectCdr.title,
                        type: this.selectCdr.type,
                        video: this.selectCdr.video,
                        week: this.selectCdr.week,
                        status: -3,
                        desc_title: this.selectCdr.desc_title,
                        edit: this.selectCdr.edit,
                        cdr_cauhoi: this.selectCdr.cdr_cauhoi,
                        course_plan_activity_id: this.selectCdr.id,
                        approved_by: this.selectCdr.approved_by,
                        approved_at: this.selectCdr.approved_at,
                        kyhieu: this.selectCdr.kyhieu,
                        desc_cpi: this.selectCdr.desc_cpi
                    };

                    forkJoin([
                        this.coursePlanActivitiesService.updateCoursePlanActivities(this.selectCdr.id, data),
                        this.coursePlanActivitiesService.addCoursePlanActivities(data_copy)
                    ]).subscribe({
                        next: () => {
                            this.noitifi.toastSuccess('Sửa thành công');
                            this.noitifi.isProcessing(false);
                            this.clearFormData();
                            this.loadCdr();
                        },
                        error: () => {
                            this.noitifi.isProcessing(false);
                            this.noitifi.toastSuccess('Sửa thất bại');
                        }
                    });
                } else {
                    this.coursePlanActivitiesService.updateCoursePlanActivities(this.selectCdr.id, data).subscribe({
                        next: () => {
                            this.noitifi.toastSuccess('Sửa thành công');
                            this.clearFormData();
                            this.loadCdr();
                        },
                        error: () => {
                            this.noitifi.isProcessing(false);
                            this.noitifi.toastSuccess('Sửa thất bại');
                        }
                    });
                }
            } else {
                this.coursePlanActivitiesService.addCoursePlanActivities(data).subscribe({
                    next: () => {
                        this.noitifi.toastSuccess('Tạo thành công');
                        this.loadCdr();
                    },
                    error: () => {
                        this.noitifi.isProcessing(false);
                        this.noitifi.toastSuccess('Tạo thất bại');
                    }
                });
            }
        } else {
            this.noitifi.toastWarning("Vui lòng kiểm tra lại thông tin đã nhập");
        }
    }

    onBeforeToggle(panelplan) {
        panelplan['animating'] = true;
    }

    async deleteCdr(cdr) {
        const condition_question: ConditionOption = {
            condition: [
                { conditionName: 'reference', condition: OvicQueryCondition.equal, value: 'course_plan_activities', orWhere: 'and' },
                { conditionName: 'reference_id', condition: OvicQueryCondition.equal, value: cdr.id.toString(), orWhere: 'and' },
                { conditionName: 'course_id', condition: OvicQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                { conditionName: 'status', condition: OvicQueryCondition.notEqual, value: '-3', orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '1' }
            ],
            page: null
        };

        this.noitifi.isProcessing(true);

        const question = await firstValueFrom(this.courseQuestionsService.getCourseQuestionsByPageNew(condition_question));

        this.noitifi.isProcessing(false);

        if (question && question.recordsFiltered !== 0) {
            return this.noitifi.toastWarning("CPI này đã có câu hỏi, không thể xóa");
        }

        this.noitifi.confirmDelete(1).subscribe(a => {
            if (a) {
                this.coursePlanActivitiesService.deleteCoursePlanActivities(cdr.id).subscribe({
                    next: () => {
                        this.noitifi.toastSuccess("Xóa thành công");
                        this.loadCdr();
                    },
                    error: () => {
                        this.noitifi.toastError("Xóa thất bại");
                    }
                });
            }
        });
    }

    closeForm() {
    }

    moveToQuestions(cdr: CoursePlanActivities) {
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['admin/nganhang-cauhoi/chuandaura'], { queryParams: { code: cdr.id } })
        );

        window.open(url, '_blank');
    }

    keyupCheckyhieu(event) {
        if (event) {
            if (/[0-9]/.test(event.key) || event.key === 'Backspace') {
                return true;
            }
            return false;
        }
        return false;
    }

    yeucauduyet(cdr: CoursePlanActivities) {
        this.nhanxetnoidung.yeucauduyet(cdr);
    }
}
