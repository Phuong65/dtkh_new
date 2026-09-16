
export interface CtdtMuctieuCuthe {
    id?: number;
    ctdt_id: number;
    kyhieu: string;
    noidung: string;
    ordering: number;
    type: 'KIENTHUC' | 'KYNANG' | 'MDTC_TN' | 'KYSU';
    tuongthich: string[];
}

export const TYPE_CTDT_MUCTIEU_CUTHE = [
    { key: 'KIENTHUC', label: 'Kiến thức', disabled: false },
    { key: 'KYNANG', label: 'Kỹ năng', disabled: false },
    { key: 'MDTC_TN', label: 'Mức độ tự chủ và trách nhiệm', disabled: false },
    { key: 'KYSU', label: 'Kỹ sư', disabled: false }
]