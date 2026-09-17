import { Component, input } from '@angular/core';
import { Course } from '@models/course';

@Component({
    selector: 'app-course-settings',
    standalone: true,
    imports: [],
    templateUrl: './course-settings.component.html'
})
export class CourseSettingsComponent {
    /** Môn học đang xem, do trang course-detail truyền xuống. */
    readonly course = input<Course | null>(null);

    /** Id môn học, dùng khi tab cần gọi API riêng. */
    readonly courseId = input<number>(0);
}
