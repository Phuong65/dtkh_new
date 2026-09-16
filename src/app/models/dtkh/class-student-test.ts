export interface ClassStudentTest {
    id?: number;
    class_id: number;
    class_test_id: number;
    student_id: number;
    point: number;
    time: number;
    note: string;
    map?: ClassStudentTestMap[];
    status?: number;
}

export interface ClassStudentTestMap {
    prefix: string;
    question: number[];
    ordering: number;
    invertedQuestion: boolean;
    invertedAnswer: boolean;
    totalQuestion: number; // tổng số câu hỏi trong nhóm
    point: string;
}