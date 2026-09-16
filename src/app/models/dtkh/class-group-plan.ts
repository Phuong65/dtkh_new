export interface ClassGroupPlan {
    id?: number;
    class_id: number,
    class_group_id: number,
    week: number,
    teaching_day: string,
    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;
}