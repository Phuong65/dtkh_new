import { PARAMS_THIDUAN } from "./thi-shift-students-duan";

export interface ThiShiftGroupDuan {
    id?: number;
    shift_id: number;
    course_plan_activity_tuluan_id: number;
    student_ids: number[];
    leader_id: number;
    params: PARAMS_THIDUAN;
    room: string;
}