import { IctuBaseModel } from '@models/ictu-base-model';
import { ICTUStandardFile } from '@models/file';

export interface CourseParams {
    sotinchi?: number;
    sotinchi_th?: number;
    exam_format?: string;
    exam_type?: number | string;
    cdr?: number;
    tongsogio?: number;
    lythuyet?: number;
    thaoluan_baitap?: number;
    th_thinghiem?: number;
    kiemtra_dinhky?: number;
    tuhoc?: number;
}

export interface Course extends Partial<IctuBaseModel> {
    id: number;
    title: string;
    maso: string;
    slug?: string;
    desc?: string;
    muctieu?: string;
    yeucau_sinhvien?: string;
    category_ids?: number | null;
    nganh_bomon_id?: number | null;
    creator_plan_id?: number | null;
    tailieu_chinh?: ICTUStandardFile[];
    tailieu_thamkhao?: ICTUStandardFile[];
    params?: CourseParams;
    status?: number;
    editor_name?: string;
    category_name?: string;
    sotinchi?: number;
    hinhthucthi?: string;
    chuandaura?: string;
    index_?: number;
    show_name?: string;
}
