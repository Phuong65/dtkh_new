import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { filter, Subject, takeUntil } from 'rxjs';
import { Course } from '@models/course';
import { CourseService } from '@services/course.service';
import { LoadingProgressComponent } from '@theme/components/loading-progress/loading-progress.component';

export interface CourseDetailTab {
    key: string;
    path: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterOutlet, MatButtonModule, LoadingProgressComponent],
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
    readonly activeTab = signal<string>('info');

    readonly tabs: CourseDetailTab[] = [
        { key: 'info', path: 'info', label: 'Thông tin', icon: 'fa-circle-info' },
        { key: 'outcomes', path: 'outcomes', label: 'Mục tiêu - CĐR', icon: 'fa-bullseye' },
        { key: 'content', path: 'content', label: 'Nội dung', icon: 'fa-book-open' },
        { key: 'questions', path: 'questions', label: 'CĐR - Câu hỏi', icon: 'fa-list-check' },
        { key: 'assessment', path: 'assessment', label: 'Kiểm tra - Đánh giá', icon: 'fa-clipboard-check' },
        { key: 'exam-form', path: 'exam-form', label: 'Form đề', icon: 'fa-file-lines' },
        { key: 'settings', path: 'settings', label: 'Cấu hình', icon: 'fa-gear' }
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
            if (id) {
                this.loadCourse(id);
                // Đồng bộ queryParams { code: id } để các component tab con đọc được dữ liệu
                const queryCode = Number(this.route.snapshot.queryParamMap.get('code'));
                if (queryCode !== id) {
                    this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: { code: id },
                        queryParamsHandling: 'merge',
                        replaceUrl: true
                    });
                }
            }
        });

        this.syncActiveTab();
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe(() => this.syncActiveTab());
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

    private syncActiveTab(): void {
        const segments = this.router.url.split('?')[0].split('/').filter(Boolean);
        const activeSegment = segments[segments.length - 1];
        const found = this.tabs.find(tab => tab.path === activeSegment);
        this.activeTab.set(found ? found.key : 'info');
    }

    selectTab(tab: CourseDetailTab): void {
        this.router.navigate([tab.path], {
            relativeTo: this.route,
            queryParamsHandling: 'merge'
        });
    }

    backToList(): void {
        this.router.navigate(['/admin/daotao_ld/quanly-monhoc']);
    }
}