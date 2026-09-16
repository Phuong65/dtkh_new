import { ElngUserProfile } from "./elng-user-profile";


export interface ThiShiftStudentsDuan {
    id?: number;
    shift_id: number;
    student_id: number;
    student_user_id: number;
    course_plan_activity_tuluan_id?: number;
    sbd: string;
    ordering: number;
    room: string;
    params?: PARAMS_THIDUAN;
    point?: number;
    note?: string;
    student?: ElngUserProfile;
    locked?: number;
    point_cham?: number;
}

export interface PARAMS_THIDUAN {
    tieuchicham: TIEUCHICHAM_DUAN[];
}

export interface TIEUCHICHAM_DUAN {
    id: number;
    ordering: number;
    title: string;
    point_cham: number;
    point: number;
    point_change: number;
    cdr: number;
}