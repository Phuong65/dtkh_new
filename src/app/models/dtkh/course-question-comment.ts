import { User } from "@core/models/user";

export interface CourseQuestionComment {
    id?: number;
    course_plan_activity_id: number;
    course_question_id: number;
    comment: string;
    status: number;
    user_id: number;
    created_by?: number;
    updated_by?: number;
    course_id: number;
    parent_id?: number;
    user?: User
    cap_hoidong?: 'cap_khoa' | 'cap_truong';
}