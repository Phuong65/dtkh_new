import { User } from "@core/models/user";

export interface HoidongThamdinhThanhvien {
    id?: number;
    user_id: number;
    hoidong_thamdinh_id: number;
    user?: User;
    chutich?: boolean;
    display_chutich?: boolean;
}
