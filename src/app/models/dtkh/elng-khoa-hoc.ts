import { key_server } from '@env';
import { OvicFileStore } from './file-store';
import { DocumentFileAndLink } from '../components/form-document-file-and-link/form-document-file-and-link.component';
import { User } from '@core/models/user';
export interface ElnKhoaHoc {
    dot_capnhat?: string;
    id?: number;
    subtitle: string;
    category_ids: number;
    slug: string;
    title: string;
    desc: string;
    parent_id: number;
    ordering: number;
    showName: string;
    img_url: string;
    keyword: string;
    files: OvicFileStore[];
    creator_id: number;
    price: number;
    discount: number;
    seo: string;
    video_introduce: string;
    num_of_like: number;
    num_of_view: number;
    status: number;
    checkedVideo: string;
    currency_price: string;
    currency_discount: string;
    creator_name: string;
    feature: number;
    decuong: OvicFileStore[];
    sobaigiang: number;
    maso: string;
    updated_by: number;
    update_ids: number;
    teacher_ids?: string;
    playlist_id?: string;
    playlist_source?: string;
    nganh_bomon_id?: number;
    type_test?: 'tienganh' | 'monkhac';
    params?: CourseParams;
    creator_plan_id?: number;
    av?: number;
    copy_course_id?: number;
    yeucau_sinhvien?: string;
    muctieu?: string;
    tailieu_thamkhao?: DocumentFileAndLink[];
    tailieu_chinh?: DocumentFileAndLink[];
    creatorPlan?:User;
}

export interface CourseParams {
    sotinchi: number;
    exam_format: 'TRACNGHIEM' | 'THUCHANH' | 'DOAN' | 'DUAN';
    cdr: number;
    sotinchi_th?: number;
    exam_type: 'et_1' | 'et_2' | 'et_3' | 'et_4' | 'et_5' | 'et_6' | 'et_7' | 'et_8' | 'et_9';
    tongsogio?: number;
    lythuyet?: number;
    thaoluan_baitap?: number;
    th_thinghiem?: number;
    kiemtra_dinhky?: number;
    tuhoc?: number;
}

export function getExamFormat() {
    let exam = [
        { id: 'et_1', key: 'TRACNGHIEM', label: 'Trắc nghiệm' },
        { id: 'et_2', key: 'THUCHANH', label: 'Thực hành' },
        { id: 'et_3', key: 'THUCHANH', label: 'Tự luận' },
        { id: 'et_4', key: 'THUCHANH', label: 'Vấn đáp' },
        { id: 'et_5', key: 'THUCHANH', label: 'Vẽ' },
        { id: 'et_6', key: 'DUAN', label: 'Đồ án' },
        { id: 'et_7', key: 'DUAN', label: 'Dự án' },
        { id: 'et_8', key: 'DUAN', label: 'Báo cáo' },
        { id: 'et_9', key: 'DUAN', label: 'Tiểu luận' },
    ];

    switch (key_server) {
        case 'hvu':
            exam = [
                { id: 'et_1', key: 'TRACNGHIEM', label: 'Trắc nghiệm' },
                { id: 'et_2', key: 'THUCHANH', label: 'Thực hành' },
                { id: 'et_6', key: 'DOAN', label: 'Đồ án' },
                { id: 'et_4', key: 'BAITAPLON', label: 'Bài tập lớn' },
            ];
            break;
        default:
            break;
    }

    return exam;
}

export const EXAMFORMAT = getExamFormat();



