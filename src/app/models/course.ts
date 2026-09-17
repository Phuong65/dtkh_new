import { IctuBaseModel } from '@models/ictu-base-model';
import { ICTUStandardFile, IctuFile } from '@models/file';

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

/** Tài liệu môn học: giữ tương thích file trực tiếp và cấu trúc file/link. */
export interface CourseDocumentItem {
    ordering: number;
    type: 'link' | 'file';
    title: string;
    link?: string;
    file?: IctuFile;
}

export type CourseDocument = ICTUStandardFile | CourseDocumentItem;

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
    tailieu_chinh?: CourseDocument[];
    tailieu_thamkhao?: CourseDocument[];
    params?: CourseParams;
    status?: number;
    editor_name?: string;
    category_name?: string;
    sotinchi?: number;
    hinhthucthi?: string;
    chuandaura?: string;
    index_?: number;
    show_name?: string;
    av?: number;
}
