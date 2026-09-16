import { TRACKING } from "./thi-shift-students";

export interface ClassPlanActivitiesTests {
    id?: number;
    class_plan_activities_id: number;
    student_id: number;
    class_id: number;
    course_id: number;
    status: number;
    time: number;
    tracking: TRACKING[];
    progress: number;
    lock: number;
    point: number;
    params: string;
    questions: string;
    stopped: number;
    violation_of_exam?: VIOLATION;
    time_remaining: number;
}

export interface VIOLATION {
    key: string;
    note: string;
    user_id: number;
    title: string;
}
