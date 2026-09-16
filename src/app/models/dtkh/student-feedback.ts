import { OvicFileInfo } from './file-store';

export interface StudentFeedback {
    id: number;
    donvi_chuyenmon_id: number;
    student_feedback_category_id: number;
    content: string;
    attachments?: OvicFileInfo[];
    school_year?: string | null;
    semester?: string | null;
    created_at: string;
    updated_at?: string | null;
}