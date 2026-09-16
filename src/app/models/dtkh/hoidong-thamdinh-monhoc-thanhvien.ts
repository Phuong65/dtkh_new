import { User } from "@core/models/user";

export interface HoidongThamdinhMonhocThanhvien {
    id?: number;
    course_id: number;
    user_id: number;
    chutich: number;
    hoidong_thamdinh_monhoc_id: number;
    hoidong_thamdinh_id;
    //ordering: number;
    user?: User;
}