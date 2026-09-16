export interface CtdtConfig {
    id?: number;
    ctdt_id: number;
    group: 'KHUNG_TRINH_DO' | 'KHOI_KIEN_THUC' | 'TUONGTHICH_PEOs' | string;
    key: string;
    title: string;
    ordering?: number;
    noidung?: string;
    value?: number;
    params?: any;
}