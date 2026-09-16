import { User } from "@core/models/user";

export interface CoursePlanTuluanComment {
    id?: number;
    course_plan_activity_id: number;
    comment: string;
    status: number;
    user_id: number;
    created_by?: number;
    updated_by?: number;
    course_id: number;
    parent_id?: number;
    course_plan_activity_tuluan_id?: number;
    user?: User;
    cap_hoidong?: 'cap_truong' | 'cap_khoa';
}