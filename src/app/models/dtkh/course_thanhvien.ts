import { User } from "@core/models/user";

export interface CourseThanhvien {
    id?: number;
    course_id: number;
    user_id: number;
    vaitro: 'CHUTICH' | 'UYVIEN';
    cap_hoidong?: 'cap_truong' | 'cap_khoa';
    user: User;
}