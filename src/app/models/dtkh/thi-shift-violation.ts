export interface ThiShiftViolation {
    id?: number;
    shift_student_id: number;
    violation_key: string;
    note: string;
    student_id: number;
    shift_id: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}
