import { CommonModule } from '@angular/common';
import { Component, effect, input, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { concatMap, forkJoin, from, of } from 'rxjs';
import { AppState } from '@models/app-state';
import { Course } from '@models/course';
import { CoursePlanActivities } from '@models/dtkh/course-plan-activities';
import { CourseQuestions } from '@models/dtkh/course-questions';
import { IctuQueryCondition } from '@models/dto';
import { ConditionOption } from '@models/condition-option';
import { CourseService } from '@services/course.service';
import { CoursePlanActivitiesService } from '@services/course-plan-activities.service';
import { CourseQuestionsService } from '@services/course-questions.service';
import { NotificationService } from '@services/notification.service';
import { Helper } from '@utilities/helper';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';

const CHUAN_DAU_RA = [
    { id: 1, label: 'Biết', disabled: false }, { id: 2, label: 'Hiểu', disabled: false },
    { id: 3, label: 'Vận dụng', disabled: false }, { id: 4, label: 'Phân tích', disabled: false },
    { id: 5, label: 'Đánh giá', disabled: false }, { id: 6, label: 'Sáng tạo', disabled: false }
] as const;

export interface PlanActivityCdr extends CoursePlanActivities {
    total_question: number;
    cdr_percent: Record<number, number>;
    cdr_name: string;
    cdr_level: number;
    require_cdr: boolean;
    min_cdr_question: Record<number, number>;
}

type CourseWithQuestionCdr = Course & {
    total_question?: number;
    cdr_percent?: Record<number, number>;
    cdr_question?: Record<number, number>;
    class_require?: Record<number, boolean>;
    require_cdr?: boolean;
};

@Component({
    selector: 'app-monhoc-question-cdr',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        DialogModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatProgressBarModule,
        LoadingProgressComponent
    ],
    templateUrl: './monhoc-question-cdr.component.html',
    styleUrl: './monhoc-question-cdr.component.css'
})
export class MonhocQuestionCdrComponent {
    readonly course = input<Course | null>(null);
    readonly courseId = input<number>(0);
    readonly state: WritableSignal<AppState> = signal<AppState>('loading');
    readonly saving = signal(false);

    readonly chuandaura = CHUAN_DAU_RA;
    readonly label_week = 'Bài';
    readonly waitingTitle = 'Đang cập nhật dữ liệu, vui lòng chờ';

    selectedCourse: CourseWithQuestionCdr | null = null;
    list_cdr_cauhoi: PlanActivityCdr[] = [];
    selectedCdr: PlanActivityCdr | null = null;
    khuyennghi: Array<{ label: string; html: string; value: number }> = [];
    closeLeft = false;
    displayModal = false;
    totalCdrCauhoi: number | null = null;
    progressValue = 0;
    private loadedCourseId = 0;

    constructor(
        private readonly courseService: CourseService,
        private readonly coursePlanActivitiesService: CoursePlanActivitiesService,
        private readonly courseQuestionsService: CourseQuestionsService,
        private readonly notificationService: NotificationService
    ) {
        effect(() => {
            const course = this.course();
            const id = course?.id || this.courseId();
            if (id && id !== this.loadedCourseId) {
                this.loadedCourseId = id;
                this.selectedCourse = course as CourseWithQuestionCdr | null;
                this.loadCDRCauhoi(id);
            }
        });
    }

    private activityCondition(courseId: number): ConditionOption {
        return {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId.toString(10) },
                { conditionName: 'week', condition: IctuQueryCondition.notEqual, value: '0' },
                { conditionName: 'week', condition: IctuQueryCondition.lessThan, value: '100' },
                { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-3' }
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
    }

    private questionCondition(courseId: number): ConditionOption {
        return {
            condition: [
                { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId.toString(10) },
                { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-3' },
                { conditionName: 'reference', condition: IctuQueryCondition.equal, value: 'course_plan_activities' },
                { conditionName: 'group_id', condition: IctuQueryCondition.equal, value: '0' }
            ],
            set: [{ label: 'limit', value: '-1' }, { label: 'select', value: 'week,group_id,cdr,reference_id,id' }],
            page: null
        };
    }

    loadCDRCauhoi(courseId: number): void {
        this.state.set('loading');
        const courseCondition: ConditionOption = {
            condition: [{ conditionName: 'id', condition: IctuQueryCondition.equal, value: courseId.toString(10) }],
            set: [{ label: 'limit', value: '1' }],
            page: null
        };
        forkJoin({
            course: this.course() ? of(this.course() as Course) : this.courseService.getCourseById(courseId),
            activities: this.coursePlanActivitiesService.getCoursePlanActivitiesByPageNew(this.activityCondition(courseId)),
            questions: this.courseQuestionsService.getCourseQuestionsByPageNew(this.questionCondition(courseId))
        }).subscribe({
            next: ({ course, activities, questions }) => {
                this.selectedCourse = course as CourseWithQuestionCdr;
                const questionIds = (questions.data || []).map(question => question.id).filter((id): id is number => !!id);
                if (questionIds.length) {
                    const childCondition: ConditionOption = {
                        condition: [
                            { conditionName: 'course_id', condition: IctuQueryCondition.equal, value: courseId.toString(10) },
                            { conditionName: 'status', condition: IctuQueryCondition.notEqual, value: '-3' }
                        ],
                        set: [
                            { label: 'limit', value: '-1' },
                            { label: 'include', value: questionIds.join(',') },
                            { label: 'include_by', value: 'group_id' },
                            { label: 'select', value: 'week,group_id,cdr,reference_id,id' }
                        ],
                        page: null
                    };
                    this.courseQuestionsService.getCourseQuestionsByPageNew(childCondition).subscribe({
                        next: children => this.finishLoad(activities.data, [...questions.data, ...children.data]),
                        error: () => this.failLoad()
                    });
                } else {
                    this.finishLoad(activities.data, questions.data);
                }
            },
            error: () => this.failLoad()
        });
    }

    private finishLoad(activities: CoursePlanActivities[], questions: CourseQuestions[]): void {
        const parents = activities.filter(activity => activity.parent_id === 0);
        this.list_cdr_cauhoi = parents.map(parent => {
            const children = activities
                .filter(activity => activity.parent_id === parent.id && activity.type !== 'ACTIVITY_CDR')
                .map(activity => this.prepareActivity(activity, questions));
            return {
                ...parent,
                total_question: 0,
                cdr_percent: {},
                cdr_name: '',
                cdr_level: 0,
                require_cdr: false,
                min_cdr_question: {},
                children: Helper.arraySort(children, 'ordering')
            } as PlanActivityCdr;
        }).filter(parent => parent.children?.length) as PlanActivityCdr[];
        this.recalculateCourse();
        this.state.set('success');
    }

    private prepareActivity(activity: CoursePlanActivities, questions: CourseQuestions[]): PlanActivityCdr {
        const info = activity.params?.cdr?.cdr_info || [];
        const levelInfo = info.find(item => item.id === 'level_require');
        const level = Number(levelInfo?.key || 1);
        const cdr: Record<number, number> = { ...(activity.cdr_cauhoi || {}) };
        this.chuandaura.forEach(item => { if (!item.disabled && cdr[item.id] == null) cdr[item.id] = 0; });
        const nested = this.selectedCourse?.av === 1;
        const relatedQuestions = questions.filter(question => question.reference_id === activity.id && (nested ? question.group_id !== 0 : question.group_id === 0));
        const min: Record<number, number> = {};
        this.chuandaura.forEach(item => min[item.id] = relatedQuestions.filter(question => question.cdr === item.id).length);
        const result = { ...activity, cdr_cauhoi: cdr, cdr_name: levelInfo?.value || '', cdr_level: level, cdr_percent: {}, min_cdr_question: min, total_question: 0, require_cdr: false } as PlanActivityCdr;
        this.recalculateActivity(result);
        return result;
    }

    private recalculateActivity(activity: PlanActivityCdr): void {
        const values = activity.cdr_cauhoi || {};
        const total = this.chuandaura.reduce((sum, item) => sum + (Number(values[item.id]) || 0), 0);
        activity.total_question = total;
        activity.cdr_percent = {};
        this.chuandaura.forEach(item => activity.cdr_percent[item.id] = total ? this.round((Number(values[item.id]) || 0) / total * 100) : 0);
        const before = this.sumPercent(activity, item => item.id < activity.cdr_level);
        const after = this.sumPercent(activity, item => item.id > activity.cdr_level);
        const minInvalid = this.chuandaura.some(item => (Number(activity.cdr_cauhoi[item.id]) || 0) < (activity.min_cdr_question[item.id] || 0));
        activity.require_cdr = minInvalid || before > 40 || activity.cdr_percent[activity.cdr_level] + after < 50;
    }

    private recalculateCourse(): void {
        if (!this.selectedCourse) return;
        const totals: Record<number, number> = {};
        this.chuandaura.forEach(item => totals[item.id] = 0);
        let total = 0;
        this.list_cdr_cauhoi.forEach(parent => ((parent.children || []) as PlanActivityCdr[]).forEach(child => {
            this.recalculateActivity(child);
            total += child.total_question;
            this.chuandaura.forEach(item => totals[item.id] += Number(child.cdr_cauhoi?.[item.id]) || 0);
        }));
        this.selectedCourse.total_question = total;
        this.selectedCourse.cdr_question = totals;
        this.selectedCourse.cdr_percent = {};
        this.chuandaura.forEach(item => this.selectedCourse!.cdr_percent![item.id] = total ? this.round(totals[item.id] / total * 100) : 0);
        this.selectedCourse.require_cdr = this.list_cdr_cauhoi.some(parent => ((parent.children || []) as PlanActivityCdr[]).some(child => child.require_cdr));
    }

    private sumPercent(activity: PlanActivityCdr, predicate: (item: typeof CHUAN_DAU_RA[number]) => boolean): number {
        return this.chuandaura.filter(predicate).reduce((sum, item) => sum + (activity.cdr_percent[item.id] || 0), 0);
    }

    private round(value: number): number { return Number(value.toFixed(1)); }

    private failLoad(): void { this.state.set('error'); this.notificationService.toastError('Không thể tải dữ liệu CĐR - Câu hỏi'); }

    pointQuestionKeyDown(event: KeyboardEvent, input: HTMLInputElement): void {
        if (event.key === 'Tab') return;
        if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight/.test(event.key)) event.preventDefault();
    }

    nextInput(input: HTMLInputElement): void {
        const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('[data-cdr-question-input]'));
        const index = inputs.indexOf(input);
        inputs[(index + 1) % inputs.length]?.focus();
    }

    setNumberCdrCauhoi(activity: PlanActivityCdr): void {
        this.recalculateActivity(activity);
        this.recalculateCourse();
    }

    cdrGet(activity: PlanActivityCdr): void {
        this.selectedCdr = activity;
        if (activity.cdr_level === 1) {
            this.khuyennghi = [{ label: activity.cdr_name, html: '≥', value: 70 }];
        } else {
            this.khuyennghi = [{ label: activity.cdr_name, html: '≥', value: 50 }];
        }
    }

    closeLeftBody(): void { this.closeLeft = !this.closeLeft; }

    openAutoCdr(): void {
        if (!this.selectedCourse?.params?.cdr) {
            this.notificationService.toastWarning('Môn học này chưa xác định CDR');
            return;
        }
        this.totalCdrCauhoi = null;
        this.displayModal = true;
    }

    calculateTotalQuestions(items?: PlanActivityCdr[]): number {
        return (items || []).reduce((sum, item) => sum + (item.total_question || 0), 0);
    }

    returnPercent(): number {
        const total = this.selectedCourse?.total_question || 0;
        return this.totalCdrCauhoi ? this.round(total ? this.totalCdrCauhoi / total * 100 : 100) : 0;
    }

    saveAutoSetQuestionCdr(): void {
        const amount = Number(this.totalCdrCauhoi);
        if (!amount || amount < 1) {
            this.notificationService.toastWarning('Vui lòng nhập vào tổng số câu');
            return;
        }
        const children = this.list_cdr_cauhoi.flatMap(parent => (parent.children || []) as PlanActivityCdr[]);
        if (!children.length) return;
        children.forEach(activity => {
            activity.cdr_cauhoi ||= {};
            const level = activity.cdr_level || 1;
            activity.cdr_cauhoi[level] = (activity.cdr_cauhoi[level] || 0) + Math.floor(amount / children.length);
        });
        let remainder = amount % children.length;
        for (const activity of children) {
            if (!remainder--) break;
            const level = activity.cdr_level || 1;
            activity.cdr_cauhoi![level] = (activity.cdr_cauhoi![level] || 0) + 1;
        }
        this.recalculateCourse();
        this.displayModal = false;
        this.totalCdrCauhoi = null;
    }

    saveCdrQuestion(): void {
        if (!this.selectedCourse || this.selectedCourse.require_cdr) {
            this.notificationService.toastWarning('Vui lòng phân bổ lại số lượng câu hỏi CDR theo quy định');
            return;
        }
        const activities = this.list_cdr_cauhoi.flatMap(parent => parent.children || []).filter(activity => activity.id);
        if (!activities.length || this.saving()) return;
        this.saving.set(true);
        this.progressValue = 0;
        from(activities).pipe(concatMap((activity, index) => this.coursePlanActivitiesService.updateCoursePlanActivities(activity.id!, { cdr_cauhoi: activity.cdr_cauhoi }).pipe(
            concatMap(result => { this.progressValue = (index + 1) / activities.length * 100; return of(result); })
        ))).subscribe({
            complete: () => {
                this.saving.set(false);
                this.notificationService.toastSuccess('Lưu thành công, vui lòng kiểm tra lại');
                this.loadCDRCauhoi(this.selectedCourse!.id);
            },
            error: () => {
                this.saving.set(false);
                this.notificationService.toastError('Lưu thất bại');
            }
        });
    }
}