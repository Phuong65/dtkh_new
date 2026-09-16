import { OvicFileStore } from './file-store';
export interface Ctdt {
    id?: number;
    ten: string;
    mota: string;
    category_title?: string;
    khoa_apdung: number;
    nam: number;
    // files: OvicFileStore[];
    created_by: number;
    status: number;
    category_id: number;
    nganh_id: number;
    he_dt: string;
    danhhieu_totnghiep: string;
    thoigian_daotao: string;
    vitri_lamviec_sautotnghiep: string;
    cohoihoctap_sautotnghiep: string;
    muctieu: string;
    madt: string;
}
