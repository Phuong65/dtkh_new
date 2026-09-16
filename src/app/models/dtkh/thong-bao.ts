export interface ThongBao {
    id?: number;
    title: string;
    message: string;
    url: string;
    sender: number;
    donvi_id: number;
    created_at: string;
    params: PARAMS;
}

export interface PARAMS {
    role_id: number,
    khoa_id: number,
    bomon_id: number
}