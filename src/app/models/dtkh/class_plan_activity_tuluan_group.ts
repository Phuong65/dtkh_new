import { PARAMS_CPTL } from "./class-plan-activity-tuluan";

export interface ClassPlanActivityTuluanGroup {
    id?: number;
    class_id: number;
    ordering: number;
    course_id: number;
    course_plan_activity_tuluan_id: number;
    student_ids?: number[];
    leader_id: number;
    point?: number;
    params?: PARAMS_CPTL;
}