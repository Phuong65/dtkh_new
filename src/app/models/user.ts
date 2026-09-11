import { IctuBaseModel } from "@models/ictu-base-model";

export interface User extends IctuBaseModel {
	id : number;
	username : string;
	display_name : string;
	phone : string;
	email : string;
	password : string;
	avatar : string;
	donvi_id : number;
	realms : string[];
	status : number;
}

// export type ConstructUser = Pick<User , 'username' | 'display_name' | 'phone' | 'email' | 'password'>;

export interface Student extends IctuBaseModel {
    id : number;
    hoten : string;
    ten : string;
    student_code : string;
    ngaysinh : string;
    gioitinh : string;
    email : string;
    phone : string;
    diachi : string;
    status : number;
    user_id? : number;
    category_name? : string;
    tenlop_quanly? : string;
    khoadaotao? : string | number;
    birthday_format? : string;
    reGender? : string;
    index_? : number;
}


export interface UserSignIn {
	username : string;
	password : string;
}

export interface GoogleSignIn {
	clientId : string;
	client_id : string;
	credential : string;
	select_by : string;
}
