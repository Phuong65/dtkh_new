import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { Course } from '@models/course';
import { CourseService } from '@services/course.service';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';
import { MonhocThongtinComponent } from './children/monhoc-thongtin/monhoc-thongtin.component';
import { MonhocMuctieuCdrComponent } from './children/monhoc-muctieu-cdr/monhoc-muctieu-cdr.component';
import { CourseContentComponent } from './children/content/course-content.component';
import { CourseQuestionsComponent } from './children/questions/course-questions.component';
import { CourseAssessmentComponent } from './children/assessment/course-assessment.component';
import { CourseExamFormComponent } from './children/exam-form/course-exam-form.component';
import { CourseSettingsComponent } from './children/settings/course-settings.component';

/** Id các tab của trang chi tiết môn học. */
export type CourseDetailTabKey = 'info' | 'outcomes' | 'content' | 'questions' | 'assessment' | 'exam-form' | 'settings';

export interface CourseDetailTab {
    key: CourseDetailTabKey;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        LoadingProgressComponent,
        MonhocThongtinComponent,
        MonhocMuctieuCdrComponent,
        CourseContentComponent,
        CourseQuestionsComponent,
        CourseAssessmentComponent,
        CourseExamFormComponent,
        CourseSettingsComponent
    ],
    templateUrl: './course-detail.component.html',
    styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly courseService = inject(CourseService);
    private readonly destroy$ = new Subject<void>();

    readonly courseId = signal<number>(0);
    readonly course = signal<Course | null>(null);
    readonly loading = signal<boolean>(true);
    // Tab đang xem: chỉ là state của component, quyết định component nào hiển thị qua @switch trong template.
    readonly activeTab = signal<CourseDetailTabKey>('info');

    readonly tabs: CourseDetailTab[] = [
        { key: 'info', label: 'Thông tin', icon: 'fa-circle-info' },
        { key: 'outcomes', label: 'Mục tiêu - CĐR', icon: 'fa-bullseye' },
        { key: 'content', label: 'Nội dung', icon: 'fa-book-open' },
        { key: 'questions', label: 'CĐR - Câu hỏi', icon: 'fa-list-check' },
        { key: 'assessment', label: 'Kiểm tra - Đánh giá', icon: 'fa-clipboard-check' },
        { key: 'exam-form', label: 'Form đề', icon: 'fa-file-lines' },
        { key: 'settings', label: 'Cấu hình', icon: 'fa-gear' }
    ];

    readonly courseTitle = computed(() => {
        const item = this.course();
        if (!item) return `Chi tiết môn học #${this.courseId()}`;
        return item.maso ? `${item.title} [${item.maso}]` : item.title;
    });

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const id = Number(params.get('id'));
            this.courseId.set(id);
            this.activeTab.set('info');
            if (id) {
                this.loadCourse(id);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadCourse(id: number): void {
        this.loading.set(true);
        this.courseService.getCourseById(id).pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                this.course.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    /** Chỉ đổi state tab, không điều hướng router. */
    selectTab(key: CourseDetailTabKey): void {
        this.activeTab.set(key);
    }

    backToList(): void {
        this.router.navigate(['/admin/daotao_ld/quanly-monhoc']);
    }
}