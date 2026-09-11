import { IctuBaseModel } from '@models/ictu-base-model';

export interface UserProfile extends IctuBaseModel {
    id : number;
    user_id : number;
    student_code : string;
    full_name : string;
    name : string;
    birthday : string;
    gender : string;
    address : string;
    email : string;
    phone : string;
    status : number;
    category_name? : string;
    tenlop_quanly? : string;
    khoadaotao? : string | number;
    birthday_format? : string;
    reGender? : string;
    index_? : number;
    username? : string;
    display_name? : string;
    donvi_id? : number;
    user_status? : number;
}