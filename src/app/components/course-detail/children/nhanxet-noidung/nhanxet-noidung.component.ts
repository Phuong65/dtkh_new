import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursePlanActivities } from '@models/dtkh/course-plan-activities';
import { CoursePlanComment } from '@models/dtkh/course-plan-comment';
import { Course } from '@models/course';
import { IctuConditionParam, IctuQueryCondition } from '@models/dto';
import { AuthenticationService } from '@services/authentication.service';
import { NotificationService } from '@services/notification.service';
import { CoursePlanActivitiesService } from '@services/course-plan-activities.service';
import { CoursePlanCommentService } from '@services/course-plan-comment.service';
import { Date2textPipe } from '@pipes/date2text.pipe';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';
import { firstValueFrom } from 'rxjs';

export interface PlanCommentItem extends CoursePlanComment {
    reply_open?: boolean;
    reply_comments?: PlanCommentItem[];
    count_reply?: number;
    textarea_comment?: string;
    display_name?: string;
    my_reply_comment?: boolean;
    children?: PlanCommentItem[];
    created_at?: string;
}

export interface ActivityWithComments extends CoursePlanActivities {
    comments?: PlanCommentItem[];
}

@Component({
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Date2textPipe,
        SafeHtmlPipe
    ],
    selector: 'app-nhanxet-noidung',
    templateUrl: './nhanxet-noidung.component.html',
    styleUrls: ['./nhanxet-noidung.component.css'],
})
export class NhanxetNoidungComponent implements OnInit, OnChanges {
    @Input() activity_input?: ActivityWithComments | CoursePlanActivities | null;
    @Input() course_input?: Course | null;
    @Input() hideViewAction = false;

    selectedActivity: ActivityWithComments | null = null;
    selectedCourse: Course | null = null;
    selectedComment: PlanCommentItem | null = null;
    userId = 0;
    displayComment = false;

    private readonly auth = inject(AuthenticationService);
    private readonly notifi = inject(NotificationService);
    private readonly coursePlanCommentService = inject(CoursePlanCommentService);
    private readonly coursePlanActivitiesService = inject(CoursePlanActivitiesService);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['activity_input'] || changes['course_input']) {
            this.selectedActivity = (this.activity_input as ActivityWithComments) || null;
            this.selectedCourse = this.course_input || null;
        }
    }

    ngOnInit(): void {
        this.userId = this.auth.user?.id || 0;
    }

    openReply(comment: PlanCommentItem, index_comment: number): void {
        comment.reply_open = !comment.reply_open;
        this.selectedComment = comment;
        if (comment.reply_open) {
            this.loadReplyComment(this.selectedComment, index_comment);
        }
    }

    loadReplyComment(comment: PlanCommentItem, index_comment: number): void {
        if (!comment.id) return;

        const conditions: IctuConditionParam[] = [
            { conditionName: 'parent_id', condition: IctuQueryCondition.equal, value: comment.id.toString() }
        ];

        this.coursePlanCommentService.getCoursePlanCommentByPageNew(conditions, { limit: -1 }).subscribe({
            next: (res) => {
                const list = (res.data || []) as PlanCommentItem[];
                list.forEach(f => {
                    if (this.selectedCourse && f.user_id === this.selectedCourse.creator_plan_id && this.userId !== f.user_id) {
                        f.display_name = (this.selectedCourse as any)['user_label'] || 'Người tạo môn học';
                    } else if (f.user_id === this.userId) {
                        f.display_name = 'Phản hồi của bạn';
                        f.my_reply_comment = true;
                    } else if (comment.user_id === f.user_id) {
                        f.display_name = `Ủy viên ${index_comment + 1}`;
                    } else {
                        f.display_name = 'Ủy viên khác';
                    }
                });

                comment.reply_comments = list;
                comment.count_reply = list.length;
            },
            error: () => {
                this.notifi.toastError('Lỗi kết nối, vui lòng thử lại');
            }
        });
    }

    saveCommentReply(comment: PlanCommentItem, activity: ActivityWithComments | null, index_comment: number): void {
        const comment_content = comment.textarea_comment ? comment.textarea_comment.trim() : '';

        if (!comment_content) {
            this.notifi.toastWarning('Vui lòng nhập phản hồi trước khi gửi');
            return;
        }

        if (!activity || !this.selectedCourse) return;

        const data_comment: Partial<CoursePlanComment> = {
            course_plan_activity_id: activity.id,
            comment: comment_content,
            status: 0,
            user_id: this.userId,
            course_id: this.selectedCourse.id,
            parent_id: comment.id
        };

        this.coursePlanCommentService.addCoursePlanComment(data_comment).subscribe({
            next: () => {
                this.notifi.toastSuccess('Đã gửi phản hồi thành công');
                comment.textarea_comment = '';
                if (this.selectedComment) {
                    this.loadReplyComment(this.selectedComment, index_comment);
                }
            },
            error: () => {
                this.notifi.toastError('Lỗi kết nối, vui lòng thử lại');
            }
        });
    }

    async yeucauduyet(activities: CoursePlanActivities): Promise<void> {
        if (!activities?.id) return;

        const confirmed = await firstValueFrom(
            this.notifi.confirmDelete2({
                heading: 'Xác nhận hành động',
                htmlMessage: '<div class="alert-duyetnoidung"><span>- Bạn đang thực hiện thao tác yêu cầu duyệt nội dung giảng dạy</span><br><span>- Thao tác này không thể hoàn tác</span><br><span>- Bạn có chắc chắn yêu cầu duyệt nội dung giảng dạy này?</span></div>'
            })
        );

        if (confirmed) {
            this.notifi.isProcessing(true);
            this.coursePlanActivitiesService.updateCoursePlanActivities(activities.id, { status: -2 }).subscribe({
                next: () => {
                    activities.status = 0;
                    this.notifi.isProcessing(false);
                    this.notifi.toastSuccess('Cập nhật thành công');
                },
                error: () => {
                    this.notifi.isProcessing(false);
                    this.notifi.toastError('Cập nhật thất bại, Lỗi kết nối');
                }
            });
        }
    }

    showComment(): void {
        this.displayComment = !this.displayComment;
    }
}
