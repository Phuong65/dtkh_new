export interface ClassHomeworkPoint {
    id?: number;
    class_id: number;
    class_homework_id: number;
    class_student_id: number;
    student_id: number;
    point: number;
    status: number;
    created_at: string;
}
