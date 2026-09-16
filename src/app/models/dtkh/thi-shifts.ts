export interface ThiShifts {
    id?: number;
    name: string;
    desc: string;
    course_id: number;
    form_id: number;
    time_start: string;
    time_of_test: number;
    num_of_student: number;
    num_of_test: number;
    pass_of_test: string;
    type_of_test: "TRACNGHIEM" | "TULUAN" | "DUAN";
    dotthi: number;
    namhoc: string;
    hocky: number;
    status: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;
    tuluan_ids?: number[];
    sync_cathi_id?: string;
}
