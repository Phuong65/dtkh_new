import { Component, input } from '@angular/core';
import { Course } from '@models/course';

@Component({
    selector: 'app-course-info',
    standalone: true,
    imports: [],
    templateUrl: './course-info.component.html'
})
export class CourseInfoComponent {
    /** Môn học đang xem, do trang course-detail truyền xuống. */
    readonly course = input<Course | null>(null);

    /** Id môn học, dùng khi tab cần gọi API riêng. */
    readonly courseId = input<number>(0);
}
