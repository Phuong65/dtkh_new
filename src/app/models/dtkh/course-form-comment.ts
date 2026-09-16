import { User } from "@core/models/user";

export interface CourseFormComment {
    id?: number;
    course_id: number;
    form_type: 'TN_KTHP' | 'TH_KTHP' | 'DG' | 'TNTX' | 'CC';
    comment: string;
    parent_id: number;
    user_id: number;
    status: number;
    user?: User;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
    viewed?: number;
}
