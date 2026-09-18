import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { CheckboxModule } from 'primeng/checkbox';
import { Paginator, PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { catchError, concatMap, forkJoin, from, map, mergeMap, Observable, of, throwError, toArray } from 'rxjs';

import { IctuPermissionControl } from '@models/ictu-base-model';
import { IctuQueryCondition } from '@models/dto';
import { BUTTON_NO, BUTTON_YES } from '@models/button';
import { CoursePlanActivities } from '@models/dtkh/course-plan-activities';
import { CourseQuestions } from '@models/dtkh/course-questions';
import { ElnKhoaHoc, EXAMFORMAT } from '@models/dtkh/elng-khoa-hoc';
import { ConditionOption } from '@models/dtkh/condition-option';
import { DonVi } from '@models/danh-muc';
import { AuthenticationService } from '@services/authentication.service';
import { NotificationService } from '@services/notification.service';
import { CoursePlanActivitiesService } from '@services/dtkh/course-plan-activities.service';
import { CourseQuestionsService } from '@services/dtkh/course-questions.service';
import { ElnKhoaHocService } from '@services/dtkh/elearning-khoa-hoc.service';
import { DanhMucService } from '@services/danh-muc.service';
import { CHUAN_DAU_RA } from '@utilities/syscats';
import { XoaCauHoiTheoBaiCdrComponent } from '../xoa-cau-hoi-theo-bai-cdr/xoa-cau-hoi-theo-bai-cdr.component';
import { LoadingProgressComponent } from '@app/theme/components/loading-progress/loading-progress.component';

interface QuestionCounts {
    private: Record<number, number>;
    public: Record<number, number>;
    approved: Record<number, number>;
    pending: Record<number, number>;
}

interface CoursePlanActivityQuestion extends CoursePlanActivities {
    isExpanded?: boolean;
    cdr_name?: string;
    question_inserted?: QuestionCounts;
    question_inserted_total?: number;
}

interface DeleteQuestionsResult {
    deletedGroupCount: number;
    deletedRecordCount: number;
    protectedGroupCount: number;
    protectedRecordCount: number;
}

interface DeleteQuestionsPreview extends DeleteQuestionsResult {
    ids: number[];
}

type QuestionAllocation = Partial<Record<number | 'status', number>>;

const COURSE_PAGE_SIZE = 20;
const DELETE_QUESTIONS_BATCH_SIZE = 100;
const COURSE_QUESTION_ROUTE = 'cauhoi-tracnghiem';

@Component({
    selector: 'app-cauhoi-tracnghiem-manager',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    CheckboxModule,
    PaginatorModule,
    SelectModule,

    LoadingProgressComponent
],
    templateUrl: './cauhoi-tracnghiem-manager.component.html',
    styleUrl: './cauhoi-tracnghiem-manager.component.css',
})
export class CauhoiTracnghiemManagerComponent {

    readonly paginator = viewChild.required<Paginator>('paginator');

    readonly autoCdrQuestion = viewChild.required<TemplateRef<unknown>>('autoCdrQuestion');

    readonly permissionControl = new IctuPermissionControl(
        inject(AuthenticationService).getUserPermission(COURSE_QUESTION_ROUTE),
    );

    readonly courses = signal<ElnKhoaHoc[]>([]);

    readonly selectedCourse = signal<ElnKhoaHoc | null>(null);

    readonly plans = signal<CoursePlanActivityQuestion[]>([]);

    readonly isLoading = signal(false);

    readonly isLeftPanelCollapsed = signal(false);

    readonly searchCourse = signal('');

    readonly page = signal(1);

    readonly totalCourses = signal(0);
    readonly state = signal<'loading' | 'error' | 'success'>('loading');

    readonly auth = inject(AuthenticationService);
    readonly danhMucService = inject(DanhMucService);

    list_donvi_chuyenmon: DonVi[] = [];
    categoryFilter: number | null = null;

    get routerAdmin(): boolean {
        return this.auth.userHasRole(['truong_ld']);
    }

    get routerDaotao(): boolean {
        return this.auth.userHasRole(['daotao_ld']);
    }

    get routerKhaothi(): boolean {
        return this.auth.userHasRole(['khaothi_ld']);
    }

   

    readonly hasKthpPlan = computed(() => this.plans().some((plan: CoursePlanActivityQuestion) => plan.week === 100));

    readonly chuanDauRa = CHUAN_DAU_RA;

    readonly coursePageSize = COURSE_PAGE_SIZE;

    readonly courseQuestionService = inject(CourseQuestionsService);

    private readonly courseService = inject(ElnKhoaHocService);

    private readonly coursePlanService = inject(CoursePlanActivitiesService);

    private readonly notification = inject(NotificationService);

    private readonly modalService = inject(NgbModal);

    private readonly router = inject(Router);

    private currentQuestions: CourseQuestions[] = [];

    private selectedKthpPlan: CoursePlanActivityQuestion | null = null;

    allocation: QuestionAllocation = {};

    allocationRequiresReview: Record<number, boolean> = {};

    hasAcceptedAllocation = false;

    get canAdd(): boolean {
        return this.permissionControl.canCreate;
    }

    get canDelete(): boolean {
        return this.permissionControl.canDelete;
    }

    get unLimitQuestion(): boolean {
        return false;
    }

    questionChildren(plan: CoursePlanActivityQuestion): CoursePlanActivityQuestion[] {
        return (plan.children ?? []) as CoursePlanActivityQuestion[];
    }

    constructor() {

    
        this.loadDonViChuyenMon();
        this.loadCourses();
    }

    loadDonViChuyenMon(): void {
        this.danhMucService.getDonViList().subscribe({
            next: (data: DonVi[]) => {
                this.list_donvi_chuyenmon = data || [];
            },
            error: () => {
                this.list_donvi_chuyenmon = [];
            }
        });
    }

    onChangeFilterChuyenmon(event: any): void {
        this.categoryFilter = event?.value ?? event?.id ?? event ?? null;
        this.loadCourses(1);
    }

    loadCourses(page: number = 1): void {
        this.isLoading.set(true);
        this.state.set('loading');
        this.page.set(page);

        const conditions: any[] = [{
            conditionName: 'status',
            condition: IctuQueryCondition.notEqual,
            value: '-1',
            orWhere: 'and' as const,
        }];
        const search = this.searchCourse().trim();
        if (search) {
            conditions.push({
                conditionName: 'title',
                condition: IctuQueryCondition.like,
                value: `%${search}%`,
                orWhere: 'and' as const,
            });
        }
        if (this.categoryFilter !== null && this.categoryFilter !== undefined) {
            conditions.push({
                conditionName: 'category_ids',
                condition: IctuQueryCondition.equal,
                value: this.categoryFilter.toString(),
                orWhere: 'and' as const,
            });
        }

        this.courseService.getKhoaHocByPageNew_2({
            condition: conditions,
            set: [
                { label: 'orderby', value: 'title' },
                { label: 'order', value: 'ASC' },
                { label: 'limit', value: COURSE_PAGE_SIZE.toString() },
                { label: 'with', value: 'creatorPlan' },
            ],
            page: page.toString(),
        }).subscribe({
            next: ({ data, recordsFiltered }): void => {
                this.courses.set(data.map((course: ElnKhoaHoc) => this.withCourseInfo(course)));
                this.totalCourses.set(recordsFiltered);
                this.isLoading.set(false);
                this.state.set('success');
            },
            error: (): void => {
                this.courses.set([]);
                this.totalCourses.set(0);
                this.isLoading.set(false);
                this.state.set('error');
                this.notification.toastError('Không tải được danh sách môn học');
            },
        });
    }

    onSearchCourse(value: string): void {
        this.searchCourse.set(value);
        this.paginator().changePage(0);
    }

    clearSearch(input?: HTMLInputElement): void {
        this.searchCourse.set('');
        if (input) {
            input.value = '';
            input.focus();
        }

        if (this.page() === 1) {
            this.loadCourses(1);
            return;
        }

        this.paginator().changePage(0);
    }

    onPageChange(event: PaginatorState): void {
        this.loadCourses((event.page ?? 0) + 1);
    }

    selectCourse(course: ElnKhoaHoc): void {
        if (!course || this.selectedCourse()?.id === course.id) {
            return;
        }
        this.selectedCourse.set(course);
        this.loadPlansAndQuestions();
    }

    onSelectCourse(event: MatSelectionListChange): void {
        const course = event.options[0]?.value as ElnKhoaHoc | undefined;
        if (!course) {
            return;
        }
        this.selectedCourse.set(course);
        this.loadPlansAndQuestions();
    }

    toggleLeftPanel(): void {
        this.isLeftPanelCollapsed.update((value: boolean) => !value);
    }

    togglePlan(plan: CoursePlanActivityQuestion): void {
        this.plans.update((plans: CoursePlanActivityQuestion[]) => plans.map((item: CoursePlanActivityQuestion) =>
            item.id === plan.id ? { ...item, isExpanded: !item.isExpanded } : item,
        ));
    }

    openKthpAllocation(plan?: CoursePlanActivityQuestion): void {
        this.selectedKthpPlan = plan ?? null;
        this.allocation = {};
        this.allocationRequiresReview = {};
        this.hasAcceptedAllocation = false;
        this.modalService.open(this.autoCdrQuestion(), {
            backdrop: 'static',
            centered: true,
            scrollable: true,
            size: 'xl',
        });
    }

    updateAllocation(): void {
        const course = this.selectedCourse();
        if (!course?.params?.cdr) {
            return;
        }

        const total = this.totalAllocation();
        const requiredLevel = course.params.cdr;
        const lowerLevels = this.chuanDauRa.filter((level) => !level.disabled && level.id < requiredLevel);
        const higherLevels = this.chuanDauRa.filter((level) => !level.disabled && level.id > requiredLevel);
        const lowerPercentage = this.totalForLevels(lowerLevels) / total * 100;
        const higherPercentage = this.totalForLevels(higherLevels) / total * 100;
        const requiredPercentage = this.allocation[requiredLevel] / total * 100;

        this.allocationRequiresReview = this.chuanDauRa.reduce<Record<number, boolean>>((result, level) => ({
            ...result,
            [level.id]: level.id < requiredLevel
                ? lowerPercentage > 40
                : level.id > requiredLevel
                    ? higherPercentage > 10
                    : requiredPercentage < 50,
        }), {});
    }

    saveKthpAllocation(close: (result?: unknown) => void): void {
        if (!this.hasAcceptedAllocation || Object.values(this.allocationRequiresReview).some(Boolean)) {
            this.notification.toastWarning('Vui lòng kiểm tra lại phân bổ câu hỏi');
            return;
        }

        const course = this.selectedCourse();
        if (!course?.id) {
            return;
        }

        const allocation: QuestionAllocation = this.withAllocationStatus(this.allocation);
        this.isLoading.set(true);

        const request = this.selectedKthpPlan?.children?.[0]
            ? this.coursePlanService.updateCoursePlanActivities(
                this.selectedKthpPlan.children[0].id,
                { cdr_cauhoi: this.combineAllocation(this.selectedKthpPlan.children[0].cdr_cauhoi, allocation) },
            )
            : this.createKthpPlan(course.id, allocation);

        request.subscribe({
            next: (): void => {
                close(true);
                this.isLoading.set(false);
                this.notification.toastSuccess('Thiết lập câu hỏi KTHP thành công');
                this.loadPlansAndQuestions();
            },
            error: (): void => {
                this.isLoading.set(false);
                this.notification.toastError('Thiết lập câu hỏi KTHP thất bại');
            },
        });
    }

    resetKthpAllocation(plan: CoursePlanActivityQuestion): void {
        const child = plan.children?.[0] as CoursePlanActivityQuestion | undefined;
        if (!child?.id) {
            return;
        }

        this.notification.confirm({
            heading: 'Hủy số lượng câu hỏi chưa nhập?',
            message: 'Hệ thống giữ lại số câu hỏi đã có.',
            buttons: [BUTTON_YES, BUTTON_NO],
        }).subscribe((answer) => {
            if (answer?.name !== 'yes') {
                return;
            }

            const allocation = this.chuanDauRa.reduce<QuestionAllocation>((result, level) => ({
                ...result,
                [level.id]: this.getTotalQuestionInserted(child, level.id),
            }), { status: 1 });
            this.coursePlanService.updateCoursePlanActivities(child.id, { cdr_cauhoi: allocation }).subscribe({
                next: (): void => {
                    this.notification.toastSuccess('Thiết lập câu hỏi KTHP thành công');
                    this.loadPlansAndQuestions();
                },
                error: (): void => this.notification.toastError('Thiết lập câu hỏi KTHP thất bại'),
            });
        });
    }

    openDeleteQuestionsByLesson(event: Event, plan: CoursePlanActivityQuestion): void {
        event.stopPropagation();
        this.openDeleteQuestionsModal(
            'bài',
            plan.week === 100 ? 'Câu hỏi thi kết thúc học phần' : `Bài ${plan.week}`,
            this.buildDeletePreview((plan.children ?? []).map((child) => child.id)),
        );
    }

    openDeleteQuestionsByCdr(event: Event, cdr: CoursePlanActivityQuestion): void {
        event.stopPropagation();
        this.openDeleteQuestionsModal(
            'CDR',
            cdr.cdr_name ? `${cdr.kyhieu} - ${cdr.cdr_name}` : cdr.kyhieu ?? '',
            this.buildDeletePreview([cdr.id]),
        );
    }

    moveToAddQuestion(plan: CoursePlanActivityQuestion): void {
        const course = this.selectedCourse();
        if (!course?.id || !plan.id) {
            return;
        }
        const url = this.router.serializeUrl(this.router.createUrlTree([
            this.router.url,
            'cauhoi-tracnghiem-chitiet',
        ], {
            queryParams: { code: course.id, node: plan.id },
        }));
        window.open(url, '_blank', 'noopener');
    }

    getTotalQuestionByKey(plan: CoursePlanActivityQuestion, key: keyof QuestionCounts): number {
        return Object.values(plan.question_inserted?.[key] ?? {}).reduce((total: number, value: number) => total + value, 0);
    }

    getTotalQuestionPlanByKey(plan: CoursePlanActivityQuestion, key: keyof QuestionCounts): number {
        return (plan.children ?? []).reduce((total: number, child: CoursePlanActivityQuestion) =>
            total + this.getTotalQuestionByKey(child, key), 0);
    }

    getTotalQuestionPlan(plan: CoursePlanActivityQuestion): number {
        return (plan.children ?? []).reduce((total: number, child: CoursePlanActivityQuestion) =>
            total + (child.question_inserted_total ?? 0), 0);
    }

    getTotalCdrQuestionLimit(plan: CoursePlanActivityQuestion): number {
        return Object.entries(plan.cdr_cauhoi ?? {}).reduce((total: number, [key, value]) =>
            Number.isNaN(Number(key)) ? total : total + Number(value), 0);
    }

    getTotalPlanQuestionLimit(plan: CoursePlanActivityQuestion): number {
        return (plan.children ?? []).reduce((total: number, child: CoursePlanActivityQuestion) =>
            total + this.getTotalCdrQuestionLimit(child), 0);
    }

    getTotalQuestionInserted(plan: CoursePlanActivityQuestion, cdrId: number): number {
        return (plan.question_inserted?.private?.[cdrId] ?? 0) + (plan.question_inserted?.public?.[cdrId] ?? 0);
    }

    totalAllocation(): number {
        return Object.values(this.allocation).reduce((total: number, value: number) => total + Number(value || 0), 0) || 1;
    }

    allocationPercent(levelId: number): string {
        return ((Number(this.allocation[levelId] ?? 0) / this.totalAllocation()) * 100).toFixed(1);
    }

    private loadPlansAndQuestions(): void {
        const course = this.selectedCourse();
        if (!course?.id) {
            return;
        }

        this.isLoading.set(true);
        forkJoin({
            plans: this.coursePlanService.getCoursePlanActivitiesByPageNew(this.planQuery(course.id)),
            questions: this.courseQuestionService.getCourseQuestionsByPageNew(this.questionQuery(course.id)),
        }).subscribe({
            next: ({ plans, questions }): void => {
                this.currentQuestions = questions.data;
                this.plans.set(this.mapPlans(plans.data, questions.data));
                this.isLoading.set(false);
            },
            error: (): void => {
                this.plans.set([]);
                this.currentQuestions = [];
                this.isLoading.set(false);
                this.notification.toastError('Không tải được thống kê câu hỏi');
            },
        });
    }

    private mapPlans(activities: CoursePlanActivities[], questions: CourseQuestions[]): CoursePlanActivityQuestion[] {
        const parentPlans = activities.filter((activity) => activity.parent_id === 0);
        return parentPlans.map((plan) => {
            const children = activities
                .filter((activity) => activity.parent_id === plan.id)
                .map((child) => this.mapCdrPlan(child, questions))
                .sort((left, right) => (left.kyhieu ?? '').localeCompare(right.kyhieu ?? '', 'vi', { numeric: true }));
            return {
                ...plan,
                isExpanded: true,
                children,
            };
        });
    }

    private mapCdrPlan(plan: CoursePlanActivities, questions: CourseQuestions[]): CoursePlanActivityQuestion {
        const groupQuestions = questions.filter((question) => question.reference_id === plan.id && question.group_id === 0);
        const counts = this.chuanDauRa.reduce<QuestionCounts>((result, level) => ({
            private: { ...result.private, [level.id]: this.countQuestions(groupQuestions, questions, (question) => question.private === 1) },
            public: { ...result.public, [level.id]: this.countQuestions(groupQuestions, questions, (question) => question.private === 0) },
            approved: { ...result.approved, [level.id]: this.countQuestions(groupQuestions, questions, (question) => question.status === 1) },
            pending: { ...result.pending, [level.id]: this.countQuestions(groupQuestions, questions, (question) => question.status !== 1) },
        }), { private: {}, public: {}, approved: {}, pending: {} });
        const cdrInfo = plan.params?.cdr?.cdr_info?.find((item) => item.id === 'level_require');
        const course = this.selectedCourse();
        const total = course?.av === 1
            ? groupQuestions.reduce((sum, question) => sum + questions.filter((item) => item.group_id === question.id).length, 0)
            : groupQuestions.length;
        return {
            ...plan,
            cdr_name: cdrInfo?.value,
            question_inserted: counts,
            question_inserted_total: total,
        };
    }

    private countQuestions(
        parentQuestions: CourseQuestions[],
        allQuestions: CourseQuestions[],
        predicate: (question: CourseQuestions) => boolean,
    ): number {
        const course = this.selectedCourse();
        const filtered = parentQuestions.filter(predicate);
        if (course?.av !== 1) {
            return filtered.length;
        }
        return filtered.reduce((total, question) => total + allQuestions.filter((item) => item.group_id === question.id).length, 0);
    }

    private planQuery(courseId: number): ConditionOption {
        return {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId.toString(), orWhere: 'and' },
                { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-3', orWhere: 'and' },
                { conditionName: 'week', condition: IctuQueryCondition.greaterThan, value: '0', orWhere: 'and' },
                { conditionName: 'week', condition: IctuQueryCondition.lessThan, value: '1000', orWhere: 'and' },
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'order', value: 'ASC' },
                { label: 'orderby', value: 'ordering' },
                { label: 'select', value: 'type,id,course_id,status,week,kyhieu,parent_id,cdr_cauhoi,ordering,params' },
            ],
            page: null,
        };
    }

    private questionQuery(courseId: number): ConditionOption {
        return {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId.toString(), orWhere: 'and' },
                { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-3', orWhere: 'and' },
                { conditionName: 'reference', condition: IctuQueryCondition.equal, value: 'course_plan_activities', orWhere: 'and' },
            ],
            set: [
                { label: 'limit', value: '-1' },
                { label: 'select', value: 'id,status,old_status,week,reference_id,private,group_id,cdr' },
            ],
            page: null,
        };
    }

    private createKthpPlan(courseId: number, allocation: QuestionAllocation): Observable<unknown> {
        return this.coursePlanService.addCoursePlanActivities({
            week: 100,
            parent_id: 0,
            course_id: courseId,
            title: 'Ngân hàng câu hỏi thi KTHP',
            type: 'PLAN',
            ordering: 100,
            status: 1,
        }).pipe(mergeMap((parentId: number) => this.coursePlanService.addCoursePlanActivities({
            week: 100,
            parent_id: parentId,
            course_id: courseId,
            title: 'Ngân hàng câu hỏi thi KTHP',
            kyhieu: 'KTHP',
            ma_cdr: 'BS',
            type: 'ACTIVITY_CDR',
            ordering: 100,
            cdr_cauhoi: allocation,
            status: 1,
        })));
    }

    private combineAllocation(current: CoursePlanActivities['cdr_cauhoi'], addition: QuestionAllocation): QuestionAllocation {
        return Object.entries(addition).reduce<QuestionAllocation>((result, [key, value]) => ({
            ...result,
            [key]: key === 'status' ? Number(value) : Number(current?.[Number(key)] ?? 0) + Number(value),
        }), {});
    }

    private withAllocationStatus(allocation: QuestionAllocation): QuestionAllocation {
        return this.chuanDauRa.reduce<QuestionAllocation>((result, level) => ({
            ...result,
            [level.id]: Number(allocation[level.id] ?? 0),
        }), { status: 1 });
    }

    private buildDeletePreview(referenceIds: number[]): DeleteQuestionsPreview {
        const referenceIdSet = new Set(referenceIds.map(Number));
        const parents = this.currentQuestions.filter((question) =>
            question.group_id === 0 && referenceIdSet.has(Number(question.reference_id)),
        );
        const deletableParents = parents.filter((question) => question.status !== 1 && question.old_status !== 1);
        const protectedParents = parents.filter((question) => question.status === 1 || question.old_status === 1);
        const deletableParentIds = new Set(deletableParents.map((question) => question.id));
        const protectedParentIds = new Set(protectedParents.map((question) => question.id));
        const deletableChildren = this.currentQuestions.filter((question) => deletableParentIds.has(question.group_id));
        const protectedChildren = this.currentQuestions.filter((question) => protectedParentIds.has(question.group_id));
        const ids = [...new Set([...deletableParents, ...deletableChildren].map((question) => question.id))];
        return {
            ids,
            deletedGroupCount: deletableParents.length,
            deletedRecordCount: ids.length,
            protectedGroupCount: protectedParents.length,
            protectedRecordCount: protectedParents.length + protectedChildren.length,
        };
    }

    private openDeleteQuestionsModal(scopeLabel: string, targetLabel: string, preview: DeleteQuestionsPreview): void {
        if (!preview.deletedGroupCount) {
            this.notification.toastInfo('Không có nhóm câu hỏi chưa duyệt đủ điều kiện xóa');
            return;
        }
        const course = this.selectedCourse();
        if (!course) {
            return;
        }
        const modal = this.modalService.open(XoaCauHoiTheoBaiCdrComponent, {
            backdrop: 'static',
            centered: true,
            keyboard: false,
            size: 'lg',
            windowClass: 'modal-custom modal-xoa-cau-hoi-theo-bai-cdr',
        });
        const component = modal.componentInstance as XoaCauHoiTheoBaiCdrComponent;
        component.courseTitle = `${course.title} (${course.maso})`;
        component.scopeLabel = scopeLabel;
        component.targetLabel = targetLabel;
        component.deletableGroupCount = preview.deletedGroupCount;
        component.deletableRecordCount = preview.deletedRecordCount;
        component.protectedGroupCount = preview.protectedGroupCount;
        component.protectedRecordCount = preview.protectedRecordCount;
        component.confirmAction = () => this.deleteQuestionsInBatches(preview);
        modal.result.then(
            (result: DeleteQuestionsResult) => {
                this.notification.toastSuccess(`Đã xóa ${result.deletedGroupCount} nhóm, ${result.deletedRecordCount} bản ghi câu hỏi`);
                this.loadPlansAndQuestions();
            },
            () => undefined,
        );
    }

    private deleteQuestionsInBatches(preview: DeleteQuestionsPreview): Observable<DeleteQuestionsResult> {
        if (!preview.ids.length) {
            return throwError(() => new Error('Không có câu hỏi đủ điều kiện xóa'));
        }
        const batches = Array.from({ length: Math.ceil(preview.ids.length / DELETE_QUESTIONS_BATCH_SIZE) }, (_, index) =>
            preview.ids.slice(index * DELETE_QUESTIONS_BATCH_SIZE, (index + 1) * DELETE_QUESTIONS_BATCH_SIZE),
        );
        return from(batches).pipe(
            concatMap((ids) => this.courseQuestionService.deleteCourseQuestions(ids.join(','))),
            toArray(),
            map(() => ({
                deletedGroupCount: preview.deletedGroupCount,
                deletedRecordCount: preview.deletedRecordCount,
                protectedGroupCount: preview.protectedGroupCount,
                protectedRecordCount: preview.protectedRecordCount,
            })),
            catchError((error: unknown) => throwError(() => error)),
        );
    }

    private totalForLevels(levels: typeof CHUAN_DAU_RA): number {
        return levels.reduce((total, level) => total + Number(this.allocation[level.id] ?? 0), 0);
    }

    private withCourseInfo(course: ElnKhoaHoc): ElnKhoaHoc {
        const format = course.params?.exam_type
            ? EXAMFORMAT.find((item) => item.id === course.params?.exam_type)
            : EXAMFORMAT.find((item) => item.key === course.params?.exam_format);
        return {
            ...course,
            creator_name: course.creatorPlan?.display_name ?? 'Chưa có giảng viên',
            info_: course.params ? ` - TC: ${course.params.sotinchi ?? 0}-${course.params.sotinchi_th ?? 0} - ${format?.label ?? ''}` : '',
        };
    }


    
}
