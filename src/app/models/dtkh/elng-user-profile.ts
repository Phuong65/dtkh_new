import { User } from "@core/models/user";

export interface ElngUserProfile {
    id?: number;
    user_id: number;
    student_code: string;
    full_name: string;
    full_name_slug: string;
    name: string;
    birthday: string;
    gender: string;
    address: string;
    social_link?: SocialLink;
    teacher?: number;
    donvi_chuyenmon_id?: number;
    created_by?: number;
    updated_by?: number;
    role_ids?: string[];
    bomon_id?: number;
    class_management_id?: number;
    user?: User;
}

export interface SocialLink {
    facebook: string;
    twitter: string;
    instagram: string;
}
