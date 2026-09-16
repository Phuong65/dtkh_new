export interface CourseFormKthp {
    id?: number;
    course_id: number;
    week: number;
    cdr: number;
    total_question_take: number;
    part: string;
    course_plan_activity_id: number;
    private?: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}
