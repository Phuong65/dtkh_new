export interface DonVi {
    id: number;
    title: string;
    code: string;
    description?: string;
    parent_id: number;
    status: number;
    created_at?: string;
    updated_at?: string;
}

export interface NganhBomon {
    id: number;
    title: string;
    slug?: string;
    code: string;
    donvi_chuyenmon_id: number;
    donvi_id?: number;
    training_mode_id?: number;
    training_mode?: string;
    type: 'nganh' | 'bomon';
    desc?: string;
    parent_id?: number;
    ordering?: number;
    icon?: string;
    status?: number;
    sup_code?: string;
    khoa?: string;
    created_at?: string;
    updated_at?: string;
}
