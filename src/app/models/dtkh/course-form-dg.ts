export interface CourseFormDg {
    id?: number;
    course_id: number;
    part?: string;
    course_plan_activity_id?: number;
    week?: number;
    cdr?: number;
    question_take?: number;
    child_question_take?: number;
    av?: number;
    point?: number;
    scan?: number;
    private?: number;
}

export interface SINHDEDG {
    course_id: number;
    week: number;
    limit?: number;
}