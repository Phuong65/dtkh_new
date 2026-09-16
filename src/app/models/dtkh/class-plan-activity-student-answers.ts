export interface ClassPlanActivityStudentAnswers {
    id?: number;
    course_id: number;
    class_plan_activity_id: number;
    student_id: number;
    course_question_id: number;
    student_answer: string;
    result: number;
    course_plan_activity_tuluan_id?: number;
    class_plan_activity_student_test_id?: number;
    point?: number;
    feedback?: string;
}