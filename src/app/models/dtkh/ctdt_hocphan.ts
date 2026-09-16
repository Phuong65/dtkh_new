import { OvicFileStore } from './file-store';
export interface CtdtHocphan {
    id?: number;
    course_id: number;
    course_name: string;
    khoikienthuc: string;
    sotinchi: number;
    sotinchi_thuchanh: number;
    hocky: number;
    category_title: string;
    status: number;
    category_id: number;
    created_by?: number;
    ctdt_id: number;
    hp_hoctruoc?: number[];
    hp_tienquyet?: number[];
    hp_songhanh?: number[];
    ordering?: number;
}
