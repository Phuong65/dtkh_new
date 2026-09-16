import { ElnKhoaHoc } from './elng-khoa-hoc';
import { OvicFileStore } from './file-store';
export interface Classes {
    id?: number;
    name: string;
    slug: string;
    course_id: number;
    course_info: string;
    user_id: number;
    manager_ids: any;
    manager_info: string;
    status: number;
    image?: OvicFileStore;
    time_start?: string;
    time_end?: string;
    hocky: string;
    namhoc: string;
    kyhieu: string;
    sotinchi: string;
    category_id: number;
    khoa?: string;
    dothoc?: number;
    sosv_dangky?: number;
    link_googlemeet?: LinkGoogleMeet[];
    donvi_chuyenmon_id?: number;
    nganh_bomon_id: number;
    params?: PARAMS;
    trongso?: TRONGSO;
    course_detail?: ElnKhoaHoc;
    sync_class_id?: string;
    locked_score?: number; // Trạng thái chốt điểm thường xuyên
}

export interface LinkGoogleMeet {
    link: string;
    created: string; // thơi gian tạo, cái này get date từ server về, KHÔNG lẤY DATE CỦA CLIENT vì có thể sai khác múi giờ
    creator_id: number
}

export interface PARAMS {
    PRACTICE_TIME_FOR_A_TEST?:number
    max_group: number,
    group_size: number,
    block_group?: boolean,
    groups?: GROUP[]
}


export interface GROUP {
    leader_id: number, // student_id
    group: number,
    members: number[] // student_id
}

export interface OvicDateTime {
    date: string;
    timestamps: number;
}

export interface TRONGSO {
    chuyencan: number;
    kiemtra: number;
}
