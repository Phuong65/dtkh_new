export interface CourseFormDuyet {
    id?: number;
    course_id: number;
    form_type: 'TN_KTHP' | 'TH_KTHP' | 'DG' | 'TNTX' | 'CC';
    approved_by?: number;
    approved_at?: string;
    status: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
}
