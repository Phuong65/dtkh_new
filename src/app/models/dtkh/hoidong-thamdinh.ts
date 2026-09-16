import { OvicDocument } from "@core/models/file";
import { HoidongThamdinhMonhoc } from "./hoidong-thamdinh-monhoc";
import { HoidongThamdinhThanhvien } from "./hoidong-thamdinh-thanhvien";

export interface HoidongThamdinh {
    id?: number;
    title: string;
    desc: string;
    type: 'celo' | 'cauhoi';
    status: number;
    date_start: string;
    date_end: string;
    category_id: number;
    countthanhviens?: number;
    countcourses?: number;
    courses?: HoidongThamdinhMonhocExpand[];
    files?: OvicDocument[];
    id_coppy?: number | null;
}


export interface HoidongThamdinhMonhocExpand extends HoidongThamdinhMonhoc {
    duyet_tn?: number,
    tong_tn?: number,
    duyet_th?: number,
    tong_th?: number,
    duyet_duan?: number,
    tong_duan?: number,
    duyet_baigiang?: number,
    tong_baigiang?: number,
    duyet_cpi?: number,
    tong_cpi?: number
}
