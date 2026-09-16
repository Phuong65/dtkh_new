import { ElngUserProfile } from "./elng-user-profile";
import { ThiShiftControls } from "./thi-shift-controls";

export interface ThiShiftStudents {
    id?: number;
    shift_id: number;
    student_id: number;
    ordering: number;
    questions?: number[];
    sbd: string;
    room: string;
    status?: number;
    completed?: number;
    pass_code?: string;
    locked?: number;
    point?: number;
    tracking?: TRACKING[];
    time_total?: string;
    time_remaining?: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
    thi_question_bank_tn_id?: number;
    student_user_id: number;
    student?: ElngUserProfile;
    controls?: ThiShiftControls[];
    _student_status?: number;
    violation_of_exam?: VIOLATION;
    progress?: number;
    warning?: string;
    submited_by?: number;
}

export interface TRACKING {
    ip: string;
    agent: string;
    time: string;
}

export interface VIOLATION {
    key: string;
    note: string;
    user_id: number;
    title: string;
}
