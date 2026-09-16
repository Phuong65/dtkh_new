import { User } from "@core/models/user";
import { HoidongThamdinhMonhocThanhvien } from "./hoidong-thamdinh-monhoc-thanhvien";
import { ElnKhoaHoc } from "./elng-khoa-hoc";

export interface HoidongThamdinhMonhoc {
    id?: number;
    leader_id: number;
    hoidong_thamdinh_id: number;
    course_id: number;
    thanhvien?: HoidongThamdinhMonhocThanhvien[];
    course?: ElnKhoaHoc;
}
