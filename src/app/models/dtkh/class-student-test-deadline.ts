export interface ClassStudentTestDeadline {
    id?: number;
    class_id: number;
    class_plan_activity_id?: number;
    student_id: number;
    deadline: string;
    week?: number;
}
