export interface ClassPlanActivitiesTestsControl {
    id?: number;
    class_plan_activities_tests_id: number;
    type: 'PAUSED' | 'CONTINUE' | 'ADD_TIME' | 'CANCEL' | 'SUBMIT' | 'VIOLATION' | 'DELETE_VIOLATION';
    message: string;
    value: number;
    sender: 'GIANGVIEN' | 'SINHVIEN';
    sender_by: number;
    received_by: number;
    status: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}
