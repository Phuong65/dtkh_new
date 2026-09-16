import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Course } from '@models/course';
import { CourseService } from '@services/course.service';
import { CourseDetailComponent, CourseDetailTabKey } from './course-detail.component';

const courseStub: Course = {
    id: 7,
    title: 'Lập trình Web',
    maso: 'IT1234'
};

describe('CourseDetailComponent', () => {
    let component: CourseDetailComponent;
    let fixture: ComponentFixture<CourseDetailComponent>;

    const tabKeys: CourseDetailTabKey[] = ['info', 'outcomes', 'content', 'questions', 'assessment', 'exam-form', 'settings'];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CourseDetailComponent],
            providers: [
                provideRouter([]),
                {
                    provide: CourseService,
                    useValue: { getCourseById: () => of(courseStub) }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CourseDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('mặc định mở tab "info" và render component của tab đó', () => {
        expect(component.activeTab()).toBe('info');
        expect(fixture.nativeElement.querySelector('app-course-info')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('app-course-settings')).toBeFalsy();
    });

    it('nhấn tab chỉ đổi id tab (không điều hướng router) và render đúng component qua @switch', () => {
        const tabs: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.course-detail-tab'));
        expect(tabs.length).toBe(tabKeys.length);
        expect(tabs.map((tab: HTMLButtonElement) => tab.textContent?.trim())).toEqual([
            'Thông tin',
            'Mục tiêu - CĐR',
            'Nội dung',
            'CĐR - Câu hỏi',
            'Kiểm tra - Đánh giá',
            'Form đề',
            'Cấu hình'
        ]);

        tabs[3].click();
        fixture.detectChanges();

        expect(component.activeTab()).toBe('questions');
        expect(fixture.nativeElement.querySelector('app-course-questions')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('app-course-info')).toBeFalsy();
        expect(tabs[3].classList.contains('is-active')).toBeTrue();
    });

    it('mỗi tab render đúng một component tương ứng', () => {
        tabKeys.forEach((key: CourseDetailTabKey, index: number) => {
            component.selectTab(key);
            fixture.detectChanges();

            const rendered: Element[] = Array.from(fixture.nativeElement.querySelectorAll('main.course-detail-content > *'));
            expect(rendered.length).toBe(1);
            expect(rendered[0].tagName.toLowerCase()).toBe(`app-course-${key}`);
            expect(fixture.nativeElement.querySelectorAll('.course-detail-tab')[index].classList.contains('is-active')).toBeTrue();
        });
    });
});
