export interface CoursePlanBank {
    id?: number;
    course_id: number;
    week?: number;
    bank_type?: 'CC' | 'DG' | 'TX' | string;
    ordering?: number;
    created_at?: string;
    updated_at?: string;
}