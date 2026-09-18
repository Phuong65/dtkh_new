import { ElngUserProfileService } from '@modules/shared/services/elearning-user-profile.service';
import { UserService } from '@core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@modules/shared/shared.module';
import { ConditionOption } from '@modules/shared/models/condition-option';
import { OvicQueryCondition } from '@core/models/dto';
import { ElnKhoaHocService } from '@modules/shared/services/elearning-khoa-hoc.service';
import { Title } from '@angular/platform-browser';
import { CHUAN_DAU_RA, ROLES, ROUTERS } from '@modules/shared/utils/syscat';
import { ElnKhoaHoc } from '@modules/shared/models/elng-khoa-hoc';
import { forkJoin, mergeMap, Observable, of } from 'rxjs';
import { CoursePlanActivities } from '@modules/shared/models/course-plan-activities';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { HelperService } from '@core/services/helper.service';
import { CoursePlanActivitiesService } from '@modules/shared/services/course-plan-activities.service';
import { CourseQuestionsService } from '@modules/shared/services/course-questions.service';
import { CourseQuestions } from '@modules/shared/models/course-questions';
import { QuestionTypeRadioAndCheckboxComponent } from "../question-types-view/question-type-radio-and-checkbox/question-type-radio-and-checkbox.component";
import { QuestionTypeInputboxComponent } from "../question-types-view/question-type-inputbox/question-type-inputbox.component";
import { QuestionTypeReorderWordsComponent } from "../question-types-view/question-type-reorder-words/question-type-reorder-words.component";
import { QuestionTypeArrangeParagraphsComponent } from "../question-types-view/question-type-arrange-paragraphs/question-type-arrange-paragraphs.component";
import { QuestionTypeDragDropComponent } from "../question-types-view/question-type-drag-drop/question-type-drag-drop.component";
import { QuestionTypeGroupInputComponent } from "../question-types-view/question-type-group-input/question-type-group-input.component";
import { QuestionTypeGroupRadioComponent } from "../question-types-view/question-type-group-radio/question-type-group-radio.component";
import { QuestionTypeGroupingComponent } from "../question-types-view/question-type-grouping/question-type-grouping.component";
import { CauhoiTracnghiemCreateFormComponent, CreateQuestionInfo } from "../cauhoi-tracnghiem-create/cauhoi-tracnghiem-create-form/cauhoi-tracnghiem-create-form.component";
import { QuestionTestPreviewComponent } from '../cauhoi-tracnghiem-create/question-test-preview/question-test-preview.component';
import { Question } from '@shared/models/question';
import { CdrName } from '../../cauhoi-tracnghiem/models/bank-questions';
import { MatMenuModule } from '@angular/material/menu';
import { Location } from '@angular/common';
import { CourseQuestionCommentService } from '@modules/shared/services/course-question-comment.service';
import { NhanxetQuestionComponent } from '../../cauhoi-tracnghiem/questions/nhanxet-question/nhanxet-question.component';
import { APP_CONFIGS } from '@env';
import { TextImportQuestionComponent } from '../text-import-question/text-import-question.component';

export interface CoursePlanActivitiesExtend extends CoursePlanActivities {
    isExpanded?: boolean;
    question_inserted?: QuestionInserted;
    cdr_name?: string;
    cdr_level?: number;
}

interface QuestionInserted {
    private: { [T: number]: number };
    public: { [T: number]: number };
    approved: { [T: number]: number };
    pending: { [T: number]: number };
}

export interface CdrAndQuestion {
    question?: CourseQuestions;
    cdrPlan: CoursePlanActivitiesExtend;
    cdrLvl: number;
}

@Component({
    selector: 'app-cauhoi-tracnghiem-chitiet',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TabViewModule,
        MatListModule,
        QuestionTypeRadioAndCheckboxComponent,
        QuestionTypeInputboxComponent,
        QuestionTypeReorderWordsComponent,
        QuestionTypeArrangeParagraphsComponent,
        QuestionTypeDragDropComponent,
        QuestionTypeGroupInputComponent,
        QuestionTypeGroupRadioComponent,
        QuestionTypeGroupingComponent,
        CauhoiTracnghiemCreateFormComponent,
        QuestionTestPreviewComponent,
        MatMenuModule,
        NhanxetQuestionComponent,
        TextImportQuestionComponent
    ],
    templateUrl: './cauhoi-tracnghiem-chitiet.component.html',
    styleUrls: ['./cauhoi-tracnghiem-chitiet.component.css']
})
export class CauhoiTracnghiemChitietComponent implements OnInit {

    @ViewChild('templateCreateQuestion') templateCreateQuestion: TemplateRef<any>;

    @ViewChild('templateTextImportQuestion') templateTextImportQuestion: TemplateRef<any>;

    @ViewChild('createQuestionForm') createQuestionForm: CauhoiTracnghiemCreateFormComponent;

    routerAdmin: boolean = false;

    routerDaotao: boolean = false;

    routerGiangvien: boolean = false;

    routerLanhdaokhoa: boolean = false;

    routerKhaothi: boolean = false;

    routerLanhdaobomon: boolean = false;

    isManager: boolean = false;

    isLanhDaoKhoa: boolean = false;

    isLanhDaoBomon: boolean = false;

    userId: number;

    canAdded: boolean = false;

    selectedCourse: ElnKhoaHoc;

    chuan_dau_ra = CHUAN_DAU_RA;

    selectPlan: CoursePlanActivitiesExtend;

    list_plan: CoursePlanActivitiesExtend[] = [];

    selectCdr: CoursePlanActivitiesExtend;

    label_week: string = "Bài";

    activeLevelId: number = 0;

    list_question: CourseQuestions[] = [];

    formTitle: string = '';

    coursePlanId: number = 0;

    isUpdated: boolean = false;

    selectQuestion: CourseQuestions;

    openTemplateAdd: boolean = false;

    createQuestionTabIndex: number = 0;

    createQuestionPreview: Question | CourseQuestions | null = null;

    unLimitQuestion: boolean = false;

    /** Preserve level selection across CDR/statistics refresh */
    private _preservedLevelId: number = 0;

    openAddQuestionAI: boolean = false;
    constructor(
        private notificationService: NotificationService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private elnKhoaHocService: ElnKhoaHocService,
        private title: Title,
        private router: Router,
        private auth: AuthService,
        private elngUserProfileService: ElngUserProfileService,
        private helperService: HelperService,
        private coursePlanActivitiesService: CoursePlanActivitiesService,
        private courseQuestionsService: CourseQuestionsService,
        private location: Location,
        private courseQuestionCommentService: CourseQuestionCommentService
    ) {

        this.isManager = this.auth.userHasRole(ROLES.manager) || this.auth.userHasRole(ROLES.admin) || this.auth.userHasRole(ROLES.troly_pdt) || this.auth.userHasRole(ROLES.chuyenvien_pdt) ? true : false;

        this.isLanhDaoKhoa = this.auth.userHasRole(ROLES.lanhdaokhoa);

        this.isLanhDaoBomon = this.auth.userHasRole(ROLES.lanhdaobomon);

        this.routerAdmin = this.auth.hasRouter(ROUTERS.admin, '/cauhoi-tracnghiem-chitiet');

        this.routerDaotao = this.auth.hasRouter(ROUTERS.daotao, '/cauhoi-tracnghiem-chitiet');

        this.routerLanhdaokhoa = this.auth.hasRouter(ROUTERS.lanhdao_khoa, '/cauhoi-tracnghiem-chitiet');

        this.routerGiangvien = this.auth.hasRouter(ROUTERS.giangvien, '/cauhoi-tracnghiem-chitiet');

        this.routerLanhdaobomon = this.auth.hasRouter(ROUTERS.lanhdao_bomon, '/cauhoi-tracnghiem-chitiet');

        this.userId = this.auth.user.id;

        this.openAddQuestionAI = this.auth.userHasRole(ROLES.manager) || this.userId === 5000420 ? true : false;
    }

    ngOnInit(): void {
        this.notificationService.setCloseLeftMenu(true);

        const config = JSON.parse(localStorage.getItem('--app_configs-' + APP_CONFIGS.realm));

        const setting = config?.find(m => m.config_key === 'SETTING')?.['params'];

        this.unLimitQuestion = setting && setting['form_question'] ? setting['form_question']['unlimit'] : false;

        this.initData();
    }

    initData() {
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params && params['code']) {

                this.notificationService.isProcessing(true);

                const node = params['node'];

                this.coursePlanId = parseInt(node);

                const course_id = params['code'];

                const contition: ConditionOption = {
                    condition: [
                        { conditionName: 'id', condition: OvicQueryCondition.equal, value: course_id.toString() },
                    ],
                    set: [
                        { label: 'limit', value: '1' }
                    ],
                    page: null
                }

                const condition_user: ConditionOption = {
                    condition: [
                        { conditionName: 'user_id', condition: OvicQueryCondition.equal, value: this.userId.toString(), orWhere: 'and' }
                    ],
                    set: [
                        { label: 'limit', value: '1' }
                    ],
                    page: null
                }

                forkJoin([
                    this.elnKhoaHocService.getKhoaHocByPageNew_2(contition),
                    this.elngUserProfileService.getUserProfileByPageNewV2(condition_user),
                ]).subscribe({
                    next: ([_course, _user_profile]) => {
                        if (_course.recordsFiltered) {
                            this.selectedCourse = _course.data[0];

                            if (this.routerLanhdaokhoa) {
                                if (_user_profile.recordsFiltered === 0 || this.selectedCourse.category_ids !== _user_profile.data[0].donvi_chuyenmon_id) {
                                    this.returnNotFoundPage();
                                }
                            }

                            if (this.routerLanhdaobomon) {
                                if (_user_profile.recordsFiltered === 0 || this.selectedCourse.nganh_bomon_id !== _user_profile.data[0].bomon_id) {
                                    this.returnNotFoundPage();
                                }
                            }

                            if (this.isManager || this.routerAdmin || this.routerDaotao || this.routerGiangvien || this.routerLanhdaobomon || this.routerLanhdaokhoa || this.userId === this.selectedCourse.creator_plan_id) {
                                this.canAdded = true;
                            } else {
                                this.canAdded = false;
                            }

                            this.title.setTitle(_course.data[0].title.concat(" - [", _course.data[0].maso, "]"));

                            this.authService.setFeatureSecondary(_course.data[0].title.concat(" - [", _course.data[0].maso, "]"));

                            this.loadCdrAndQuestion();
                        } else {
                            this.returnNotFoundPage();
                        }
                    },

                    error: () => {
                        this.returnNotFoundPage();
                    }
                })
            } else {
                this.returnNotFoundPage();
            }
        })
    }

    scrollToElement(elementId: string): void {
        setTimeout(() => {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        })
    }

    returnNotFoundPage() {
        this.notificationService.isProcessing(false);
        this.notificationService.toastError("Không tìm thấy môn học");
        return this.router.navigate(['/admin/content-none']);
    }

    loadCdrAndQuestion() {
        this.notificationService.isProcessing(true);
        const condition_cdr: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: OvicQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                { conditionName: 'status', condition: OvicQueryCondition.notEqual, value: '-3', orWhere: 'and' },
                { conditionName: 'week', condition: OvicQueryCondition.greaterThan, value: '0', orWhere: 'and' },
                { conditionName: 'week', condition: OvicQueryCondition.lessThan, value: '1000', orWhere: 'and' }
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'include', value: 'PLAN,ACTIVITY_CDR' },
                { label: 'include_by', value: 'type' },
                { label: 'order', value: 'ASC' },
                { label: 'orderby', value: 'ordering' },
                { label: 'select', value: 'type,id,course_id,status,week,kyhieu,parent_id,cdr_cauhoi,ordering,params' }
            ],
            page: null
        }

        const condition_question: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: OvicQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                { conditionName: 'status', condition: OvicQueryCondition.notEqual, value: '-3', orWhere: 'and' },
                { conditionName: 'reference', condition: OvicQueryCondition.equal, value: 'course_plan_activities', orWhere: 'and' },
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'select', value: 'id,status,week,reference_id,private,group_id,cdr' }
            ],
            page: null
        }

        if (this.selectedCourse.av !== 1) {
            condition_question.condition.push({ conditionName: 'group_id', condition: OvicQueryCondition.equal, value: '0', orWhere: 'and' })
        }

        forkJoin([
            this.coursePlanActivitiesService.getCoursePlanActivitiesByPageNew(condition_cdr),
            this.courseQuestionsService.getCourseQuestionsByPageNew(condition_question),
        ]).subscribe({
            next: ([_plan_activity, _question]) => {
                const plan_parent = _plan_activity.data.filter(m => m.parent_id === 0);
                plan_parent.forEach(f => {
                    const child = _plan_activity.data.filter(m => m.parent_id === f.id);
                    f['isExpanded'] = true;
                    child.forEach(c => {
                        if (c.params && c.params.cdr && c.params.cdr.cdr_info) {
                            const index = c.params.cdr.cdr_info.findIndex(m => m.id === 'level_require');
                            if (index !== -1) {
                                c['cdr_name'] = c.params.cdr.cdr_info[index].value;
                                c['cdr_level'] = c.params.cdr.cdr_info[index].key;
                            }
                        }

                        const question_plan_child = _question.data.filter(m => m.reference_id === c.id && m.group_id === 0);

                        c['question_inserted'] = {
                            private: {},
                            public: {},
                            approved: {},
                            pending: {},
                        }

                        c['question_inserted_total'] = question_plan_child.length;

                        if (this.selectedCourse.av === 1) {
                            let s_child = 0;
                            question_plan_child.forEach(p => {
                                s_child = s_child + _question.data.filter(m => m.group_id === p.id).length;
                            })
                            c['question_inserted_total'] = s_child;
                        }

                        this.chuan_dau_ra.forEach(cdr => {
                            const question_cdr = question_plan_child.filter(m => m.cdr === cdr.id);
                            if (question_cdr.length) {
                                if (this.selectedCourse.av === 1) {
                                    c['question_inserted']['private'][cdr.id] = this.getQuestionAvKey(question_cdr.filter(m => m.private === 1), _question.data);
                                    c['question_inserted']['public'][cdr.id] = this.getQuestionAvKey(question_cdr.filter(m => m.private === 0), _question.data);
                                    c['question_inserted']['approved'][cdr.id] = this.getQuestionAvKey(question_cdr.filter(m => m.status === 1), _question.data);
                                    c['question_inserted']['pending'][cdr.id] = this.getQuestionAvKey(question_cdr.filter(m => m.status !== 1), _question.data);
                                } else {
                                    c['question_inserted']['private'][cdr.id] = question_cdr.filter(m => m.private === 1).length;
                                    c['question_inserted']['public'][cdr.id] = question_cdr.filter(m => m.private === 0).length;
                                    c['question_inserted']['approved'][cdr.id] = question_cdr.filter(m => m.status === 1).length;
                                    c['question_inserted']['pending'][cdr.id] = question_cdr.filter(m => m.status !== 1).length;
                                }
                            }
                        })

                        c['stt'] = c.kyhieu.replace(/\D/g, '');
                    })

                    f.children = this.helperService.sort(child, 'stt');
                })

                this.list_plan = plan_parent;

                // Re-select the previously selected CDR if exists, otherwise use coursePlanId
                const targetCdrId = this.selectCdr?.id || this.coursePlanId;
                const savedLevelId = this._preservedLevelId || this.activeLevelId;

                if (this.selectCdr) {
                    const foundParent = this.list_plan.find(p => p.children?.some(ch => ch.id === this.selectCdr!.id));
                    if (foundParent) {
                        const foundCdr = foundParent.children!.find(ch => ch.id === this.selectCdr!.id);
                        if (foundCdr) {
                            const isLoadingQuestions = this.restoreSelection(foundCdr, savedLevelId);
                            if (!isLoadingQuestions) {
                                this.notificationService.isProcessing(false);
                            }
                            this._preservedLevelId = 0;
                            return;
                        }
                    }
                }

                if (this.coursePlanId) {
                    const planIndex = this.list_plan.findIndex(m => m.id === this.coursePlanId || m.children?.some(ch => ch.id === this.coursePlanId));
                    if (planIndex !== -1) {
                        const targetParent = this.list_plan[planIndex];
                        const targetCdr = targetParent.id === this.coursePlanId
                            ? (targetParent.children?.[0] || null)
                            : targetParent.children?.find(ch => ch.id === this.coursePlanId) || targetParent.children?.[0] || null;

                        if (targetCdr) {
                            const isLoadingQuestions = this.restoreSelection(targetCdr, savedLevelId);
                            const newUrl = this.router.url.split('&');
                            this.location.go(newUrl[0]);
                            this.scrollToElement('cdr_'.concat(targetCdr.id.toString()));
                            if (!isLoadingQuestions) {
                                this.notificationService.isProcessing(false);
                            }
                            this._preservedLevelId = 0;
                            return;
                        }
                    }
                }

                this.notificationService.isProcessing(false);
                this._preservedLevelId = 0;
            },
            error: () => {
                this.notificationService.isProcessing(false);
                this._preservedLevelId = 0;
            }
        })
    }

    /**
     * Select a CDR and try to restore the previously active level.
     * Falls back to the first valid level if saved level is no longer valid.
     */
    private restoreSelection(cdr: CoursePlanActivitiesExtend, savedLevelId: number): boolean {
        this.selectCdr = cdr;
        const validLevels = this.getValidLevels();
        if (validLevels && validLevels.length) {
            const levelExists = validLevels.some(l => l.id === savedLevelId);
            this.activeLevelId = levelExists ? savedLevelId : validLevels[0].id;
        } else {
            this.activeLevelId = null;
        }
        this.list_question = [];
        if (this.activeLevelId) {
            this.loadQuestionDesc();
            return true;
        }
        return false;
    }

    getQuestionAvKey(data: CourseQuestions[], question: CourseQuestions[]) {
        let result = 0;
        data.forEach(f => {
            result = result + question.filter(m => m.group_id === f.id).length;
        })
        return result;
    }

    getTotalQuestionInsetedCdr(child: CoursePlanActivitiesExtend, cdr_id: number) {
        const privateCount = child.question_inserted?.private?.[cdr_id] || 0;
        const publicCount = child.question_inserted?.public?.[cdr_id] || 0;
        return privateCount + publicCount;
    }

    onSelectCdr(cdr: CoursePlanActivitiesExtend) {
        this.selectCdr = cdr;
        this.activeLevelId = this.getValidLevels() && this.getValidLevels().length ? this.getValidLevels()[0].id : null;
        this.list_question = [];
        if (this.activeLevelId) {
            this.loadQuestionDesc();
        }
    }

    getValidLevels() {
        if (this.unLimitQuestion) {
            return this.chuan_dau_ra;
        }
        return this.chuan_dau_ra.filter(i => this.selectCdr?.cdr_cauhoi && this.selectCdr?.cdr_cauhoi[i.id] && this.selectCdr?.cdr_cauhoi[i.id] !== 0) || [];
    }

    getTotalCdrQuestionLimit(plan: CoursePlanActivitiesExtend) {
        let s = 0;
        if (plan.cdr_cauhoi && Object.keys(plan.cdr_cauhoi).length) {
            Object.keys(plan.cdr_cauhoi).forEach(f => {
                if (!isNaN(parseInt(f))) {
                    s = s + plan.cdr_cauhoi[f];
                }
            })
        }
        return s;
    }

    isQuotaFull(): boolean {
        if (this.unLimitQuestion || !this.selectCdr || !this.activeLevelId) {
            return false;
        }
        const quota = this.selectCdr?.['cdr_cauhoi']?.[this.activeLevelId.toString()];
        if (!quota) {
            return false;
        }
        return this.getTotalQuestionInsetedCdr(this.selectCdr, this.activeLevelId) >= quota;
    }

    getTotalQuestionByKey(child: CoursePlanActivitiesExtend, key: string) {
        let result = 0;
        if (child['question_inserted'] && child['question_inserted'][key]) {
            const sum = Object.values(child['question_inserted'][key]).reduce((acc: number, val: number) => acc + (val || 0), 0);
            result = Number(sum);
        }
        return result;
    }

    onSelectLvl(id: number) {
        this.activeLevelId = id;
        this.loadQuestionDesc();
    }

    loadQuestionDesc() {
        this.notificationService.isProcessing(true);

        this.list_question = [];

        const condition_question: ConditionOption = {
            condition: [
                { conditionName: 'course_id', condition: OvicQueryCondition.equal, value: this.selectedCourse.id.toString(), orWhere: 'and' },
                { conditionName: 'status', condition: OvicQueryCondition.notEqual, value: '-3', orWhere: 'and' },
                { conditionName: 'reference', condition: OvicQueryCondition.equal, value: 'course_plan_activities', orWhere: 'and' },
                { conditionName: 'reference_id', condition: OvicQueryCondition.equal, value: this.selectCdr.id.toString(), orWhere: 'and' },
                { conditionName: 'cdr', condition: OvicQueryCondition.equal, value: this.activeLevelId.toString(), orWhere: 'and' },
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'order', value: 'DESC' },
                { label: 'orderby', value: 'id' }
            ],
            page: null
        }

        this.courseQuestionsService.getCourseQuestionsByPageNew(condition_question).pipe(mergeMap(_q => {
            const question_id = _q.data.filter(m => m.group_id === 0).map(m => m.id);
            if (question_id && question_id.length) {
                const condition_comment: ConditionOption = {
                    condition: [
                        { conditionName: 'parent_id', condition: OvicQueryCondition.equal, value: '0', orWhere: 'and' }
                    ],

                    set: [
                        { label: 'limit', value: '-1' },
                        { label: 'include', value: question_id.toString() },
                        { label: 'include_by', value: 'course_question_id' }
                    ],
                    page: null
                }

                const condition_reply_comment: ConditionOption = {
                    condition: [
                        { conditionName: 'parent_id', condition: OvicQueryCondition.notEqual, value: '0', orWhere: 'and' }
                    ],
                    set: [
                        { label: 'limit', value: '-1' },
                        { label: 'select', value: 'id, parent_id' },
                        { label: 'include', value: question_id.toString() },
                        { label: 'include_by', value: 'course_question_id' }
                    ],
                    page: null
                }

                return forkJoin([
                    this.courseQuestionCommentService.getCourseQuestionCommentByPageNew(condition_comment),
                    this.courseQuestionCommentService.getCourseQuestionCommentByPageNew(condition_reply_comment)
                ]).pipe(mergeMap(([_comment, _comment_child]) => {
                    _q.data.forEach(f => {
                        if (f.group_id === 0) {
                            const comments = _comment.data.filter(m => m.course_question_id === f.id);
                            const object_comment = {};
                            comments.forEach(t => {
                                const count_reply = _comment_child.data.filter(m => m.parent_id === t.id).length;
                                t['count_reply'] = count_reply
                                if (!object_comment[t.user_id]) {
                                    object_comment[t.user_id] = [];
                                    object_comment[t.user_id].push(t);
                                }
                                else {
                                    object_comment[t.user_id].push(t)
                                }
                            })

                            f['comments'] = [];

                            Object.keys(object_comment).forEach(o => {
                                f['comments'].push({ user_id: o, children: object_comment[o] })
                            })
                        }
                    })

                    return of(_q);
                }))
            } else {
                return of(_q);
            }
        })).subscribe({
            next: (_question) => {
                const parent = _question.data.filter(m => m.group_id === 0);
                parent.forEach(f => {
                    f.children = _question.data.filter(m => m.group_id === f.id);
                })
                this.list_question = parent;
                setTimeout(() => this.notificationService.isProcessing(false));
            },
            error: () => {
                this.notificationService.isProcessing(false);
            }
        })
    }

    closeSideMenu() {
        this.notificationService.closeSideNavigationMenu();
    }

    openTextImport() {
        this.notificationService.openSideNavigationMenu({ template: this.templateTextImportQuestion, size: window.innerWidth, offsetTop: '0px' });
    }

    openCreateForm() {
        if (!this.unLimitQuestion) {
            const quota = this.selectCdr?.['cdr_cauhoi']?.[this.activeLevelId.toString()];
            if (quota && this.getTotalQuestionInsetedCdr(this.selectCdr, this.activeLevelId) >= quota) {
                return this.notificationService.toastWarning("Số lượng câu hỏi đã đạt mức tối đa, không thể thêm");
            }
        }
        this.isUpdated = false;
        this.resetCreateQuestionTabs();
        this.openTemplateAdd = false;
        this.notificationService.openSideNavigationMenu({ template: this.templateCreateQuestion, size: window.innerWidth, offsetTop: '0px' });
        setTimeout(() => {
            this.openTemplateAdd = true;
        }, 500);
    }

    closeAddQuestionForm() {
        this.openTemplateAdd = false;
        this.resetCreateQuestionTabs();
        this.closeSideMenu();
        this._preservedLevelId = this.activeLevelId;
        setTimeout(() => this.loadCdrAndQuestion());
    }

    showCreateQuestionPreview(question: Question | CourseQuestions): void {
        this.createQuestionPreview = question;
        this.createQuestionTabIndex = 1;
    }

    closeCreateQuestionPreview(): void {
        this.createQuestionPreview = null;
        this.createQuestionTabIndex = 0;
    }

    onCreateQuestionTabChange(index: number): void {
        if (index !== 1) {
            this.createQuestionTabIndex = index;
            return;
        }
        if (!this.createQuestionForm?.openKiemThu()) {
            this.createQuestionTabIndex = 0;
        }
    }

    private resetCreateQuestionTabs(): void {
        this.createQuestionTabIndex = 0;
        this.createQuestionPreview = null;
    }

    /**
     * Toggle the privacy state (Public <-> Private) of a question.
     * Questions inside KTHP (week === 100) must always stay Private.
     * After a successful toggle, only the changed question is refreshed
     * in the current list instead of reloading the whole tree.
     */
    toggleQuestionPrivate(question: CourseQuestions): void {
        if (!this.canAdded || !this.selectCdr || !question?.id) {
            return;
        }
        if (this.selectCdr.week === 100) {
            return this.notificationService.toastWarning("Không thể đổi trạng thái — câu hỏi của KTHP luôn là Private");
        }
        const newPrivate: number = question.private === 1 ? 0 : 1;
        this.notificationService.isProcessing(true);

        const requests: Observable<any>[] = [
            this.courseQuestionsService.updateCourseQuestions(question.id, { private: newPrivate })
        ];
        if (question.children && question.children.length) {
            requests.push(this.courseQuestionsService.updateCourseQuestionsByCol(question.id, { private: newPrivate }, 'group_id'));
        }

        (requests.length === 1 ? requests[0] : forkJoin(requests)).subscribe({
            next: () => {
                this.syncQuestionPrivacyLocal(question, newPrivate);
                this.notificationService.isProcessing(false);
                this.notificationService.toastSuccess("Đổi trạng thái thành công");
            },
            error: () => {
                this.notificationService.isProcessing(false);
                this.notificationService.toastError("Đổi trạng thái thất bại");
            }
        });
    }

    /**
     * Refresh ONLY the toggled question (and its group children) in the current
     * list and keep the header/sidebar stats consistent — no full reload.
     */
    private syncQuestionPrivacyLocal(question: CourseQuestions, newPrivate: number): void {
        question.private = newPrivate;
        (question.children || []).forEach(c => c.private = newPrivate);

        if (this.selectCdr?.question_inserted && this.activeLevelId) {
            const inserted = this.selectCdr.question_inserted;
            const delta = this.selectedCourse.av === 1 ? 1 + ((question.children && question.children.length) || 0) : 1;
            if (newPrivate === 1) {
                inserted.public[this.activeLevelId] = Math.max(0, (inserted.public[this.activeLevelId] || 0) - delta);
                inserted.private[this.activeLevelId] = (inserted.private[this.activeLevelId] || 0) + delta;
            } else {
                inserted.private[this.activeLevelId] = Math.max(0, (inserted.private[this.activeLevelId] || 0) - delta);
                inserted.public[this.activeLevelId] = (inserted.public[this.activeLevelId] || 0) + delta;
            }
        } else {
            this._preservedLevelId = this.activeLevelId;
            this.loadCdrAndQuestion();
        }
    }

    getPrivateToggleTitle(question: CourseQuestions): string {
        if (this.selectCdr?.week === 100) {
            return "Không thể đổi trạng thái - câu hỏi của KTHP luôn là Private";
        }
        if (!this.canAdded) {
            return "Bạn không có quyền đổi trạng thái";
        }
        return question.private === 1 ? "Đổi thành Public" : "Đổi thành Private";
    }

    deleteQuestion(question: CourseQuestions) {
        this.notificationService.confirmDelete().then(a => {
            if (a) {
                this.notificationService.isProcessing(true);
                let ids = [question.id];
                if (question.children)
                    ids = ids.concat(question.children.map(m => m.id));
                this.courseQuestionsService.deleteCourseQuestions(ids.toString()).subscribe({
                    next: () => {
                        this.notificationService.toastSuccess("Xóa thành công");
                        this._preservedLevelId = this.activeLevelId;
                        this.loadCdrAndQuestion();
                    },
                    error: () => {
                        this.notificationService.isProcessing(false);
                        this.notificationService.toastError("Xóa thất bại");
                    }
                })
            }
        })
    }

    editQuestion(question: CourseQuestions) {
        this.isUpdated = true;
        this.selectQuestion = question;
        this.resetCreateQuestionTabs();
        this.openTemplateAdd = false;
        this.notificationService.openSideNavigationMenu({ template: this.templateCreateQuestion, size: window.innerWidth, offsetTop: '0px' });
        setTimeout(() => {
            this.openTemplateAdd = true;
        }, 500);
    }
}