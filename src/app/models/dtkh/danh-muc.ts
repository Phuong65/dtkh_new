import { FormType , OvicForm } from '@shared/models/ovic-models';

export interface DanhMuc {
	id : number;
	name : string;
	code : string;
	type : LoaiDanhMuc;
	ordering : number;
	parent_id : number;
	user_id : number;
	donvi_id : number;
	states : number; //	1: active, 0:inactive
	created_at : string;
	updated_at : string;
}

export type LoaiDanhMuc = 'truong' | 'nganh'

export interface FormDanhMuc extends OvicForm {
	object : DanhMuc;
}

export type ListFormDanhMuc = {
	[ T : string ] : FormDanhMuc;
}

export const DanhMucLoaiVanBang = [
	'Sơ cấp I' ,
	'Sơ cấp II' ,
	'Sơ cấp III' ,
	'Trung cấp' ,
	'Cao đẳng' ,
	'Đại học' ,
	'Thạc sĩ' ,
	'Tiến sĩ' ,
	'Tiến sĩ khoa học'
];

type LoaiVanBang = 'Sơ cấp I' | 'Sơ cấp II' | 'Sơ cấp III' | 'Trung cấp' | 'Cao đẳng' | 'Đại học' | 'Thạc sĩ' | 'Tiến sĩ' | 'Tiến sĩ khoa học';




