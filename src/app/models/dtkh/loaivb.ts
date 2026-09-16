import { OvicSelectOption } from '@shared/models/ovic-models';

export interface VanBang {
	id : number;
	name : string;
	code : string;
	type : LoaiVanBang;
}

interface VanBangSelectOption extends OvicSelectOption {
	value : LoaiVanBang;
}

export type LoaiVanBang = 'TIENSI' | 'THACSI' | 'DAIHOC' | 'CAODANG' | 'CHUNGCHI' | 'TRUNGCAP';

export const LoaiVanBangOptions : VanBangSelectOption[] = [
	{ value : 'TIENSI' , badge : '<span class="badge badge-success badge--size-normal w-100">Tiến sĩ</span>' , label : 'Tiến sĩ' } ,
	{ value : 'THACSI' , badge : '<span class="badge badge-success badge--size-normal w-100">Thạc sĩ</span>' , label : 'Thạc sĩ' } ,
	{ value : 'DAIHOC' , badge : '<span class="badge badge-success badge--size-normal w-100">Đại học</span>' , label : 'Đại học' } ,
	{ value : 'CAODANG' , badge : '<span class="badge badge-success badge--size-normal w-100">Cao đẳng</span>' , label : 'Cao đẳng' } ,
	{ value : 'TRUNGCAP' , badge : '<span class="badge badge-success badge--size-normal w-100">Trung cấp</span>' , label : 'Trung cấp' } ,
	{ value : 'CHUNGCHI' , badge : '<span class="badge badge-success badge--size-normal w-100">Chứng chỉ</span>' , label : 'Chứng chỉ' }
];

export const LoaiVanBangMap : Map<LoaiVanBang , VanBangSelectOption> = LoaiVanBangOptions.reduce( ( collector , vb ) => {
	collector.set( vb.value , vb );
	return collector;
} , new Map<LoaiVanBang , VanBangSelectOption>() );
