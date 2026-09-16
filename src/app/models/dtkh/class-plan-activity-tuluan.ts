
export interface ClassPlanActivityTuluan {
    id?: number;
    class_id: number;
    course_id: number;
    class_plan_activity_id: number;
    course_plan_activity_tuluan_id: number;
    student_id: number;
    status: number;
    lock: number;
    point: number;
    stopped: number;
    params?: PARAMS_CPTL;
}

export interface PARAMS_CPTL {
    tieuchicham: TIEUCHICHAM_CPTL[];
}

export interface TIEUCHICHAM_CPTL {
    id: number;
    ordering: number;
    title: string;
    point_cham: number;
    point: number;
    point_change: number;
    cdr: number;
}