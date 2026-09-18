export interface CourseFormTx {
    id?: number;
    course_id: number;
    part?: string;
    course_plan_activity_id?: string;
    week?: number;
    cdr?: number;
    question_take?: number;
    child_question_take?: number;
    av?: number;
    point?: number;
    scan?: number;
    ordering?: number;
    private?: number;
}

export interface SINHDETX {
    course_id: number;
    ordering: number;
    limit?: number;
}