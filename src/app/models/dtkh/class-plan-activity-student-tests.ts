export interface ClassPlanActivityStudentTests {
    id?: number;
    class_plan_activity_id: number;
    course_id: number;
    av: number;
    class_id: number;
    student_id: number;
    point: number;
    point_tuluan?: number;
    point_tracnghiem?: number;
    tong_diem?: string;
    time: number;
    with_correct_answers: number;
    note: string;
    env: string;
    passing_point: number;
    passed: number;
    questions: string[];
    questions_tuluan?: string[];
    params: { [key: string]: any; };
    status: number;
    point_type: 'CC' | 'TX';
    week?: number;
    locked?: number;
    closed?: number;
    type?: "KT_TUAN" | "KT_DAUGIO" | "KT_TULUAN";
    violation_of_exam?: VIOLATION;
    trangthai_cham?: number; // trạng thái chấm điểm -1: đang chấm, 0: chưa chấm, 1: đã chấm
}

export interface VIOLATION {
    key: string;
    note: string;
    user_id: number;
    title: string;
}