import { SimpleFileLocal } from '@core/models/file';
import { LoaiVanBang } from '@shared/models/loaivb';

export interface QuyetDinh {
	id : number;
	so_quyetdinh : string;
	noidung : string;
	ngayky : string;
	nguoiky : string;
	chucvu_nguoiky : string;
	so_hocvien : number;
	file : SimpleFileLocal[];
	user_id : number;
	donvi_id : number;
	locked : number; // 1 : locked | 0 : unlock
	loaivb_type : LoaiVanBang; // lấy trong bảng loaivb
	states : number;
}

export const CHUC_VU = [
	{ label : 'Giám đốc' , value : 'GIAM_DOC' } ,
	{ label : 'Phó giám đốc' , value : 'PHO_GIAM_DOC' } ,
	{ label : 'Hiệu trưởng' , value : 'HIEU_TRUONG' } ,
	{ label : 'Phó hiệu trưởng' , value : 'PHO_HIEU_TRUONG' } ,
	{ label : 'Trưởng phòng' , value : 'TRUONG_PHONG' } ,
	{ label : 'Phó trưởng phòng' , value : 'PHO_TRUONG_PHONG' }
];

export interface QuyetDinhHocVien {
	id? : number;
	donvi_id : number;
	quyetdinh_id : number;
	mahocvien : string;
	hovaten : string;
	ten : string;
	ngaysinh : string;
	gioitinh : string;
	cccd : string;
	noisinh : string;
	dantoc : string;
	quoctich : string;
	nganhhoc : string; // Mã nghành | ( Tin học | Ngoại ngữ | GDQP-AN | Tiếng dân tộc - nếu là chứng chỉ )
	chuyenganh : string; // Tên chuyên nghành ( Đổi thành chương trình đào tạo) | Tên chứng chỉ nếu là chứng chỉ
	namtn : string;
	nienkhoa : string; // Năm vào trường - năm ra trường
	hinhthuc_daotao : string; // hình thức đào tạo
	loai_vbcc : string; // Cao đẳng, Đại học | Tiến sĩ | Thạc sĩ |
	xeploai : string; // Trung Bình, Trung Bình Khá, Khá, Giỏi, Xuất Sắc
	sohieu_vbcc : string;
	sovaoso : string;
	khoa_lop : string; // khóa 9 , 10
	quyetdinh_hodong : string; // Số quyết định thành lập hội đồng bảo vệ
	ngay_baove : string;
	user_id : number;
	session : string;
	school_sign : string; //Mã trường mà sinh viên đang theo học( dành cho chứng chỉ gdqp)
	graduation_on_time : number; // 1 = tốt nghiệp đúng hạn | 0 = tốt nghiệp muộn
	created_at? : string;
	updated_at? : string;
}


export type DiplomaType = 'Sơ cấp I' | 'Sơ cấp II' | 'Sơ cấp III' | 'Trung cấp' | 'Cao đẳng' | 'Đại học' | 'Thạc sĩ' | 'Tiến sĩ' | 'Tiến sĩ khoa học' | 'Chứng chỉ';

export type TrainingFormat = 'ĐHCQ' | 'VHVL' | 'VB2' | 'LTĐH' | 'KHAC' | 'CAO ĐẲNG' | 'TRUNG CẤP';

export type GraduationGrading = 'Trung bình' | 'Trung bình khá' | 'Khá' | 'Giỏi' | 'Xuất sắc' | 'KHAC';

export type GioTinh = 'Nam' | 'Nữ';

export const DiplomaTypeList : DiplomaType[] = [
	'Sơ cấp I' ,
	'Sơ cấp II' ,
	'Sơ cấp III' ,
	'Trung cấp' ,
	'Cao đẳng' ,
	'Đại học' ,
	'Thạc sĩ' ,
	'Tiến sĩ' ,
	'Tiến sĩ khoa học' ,
	'Chứng chỉ'
];

export const TrainingFormatList : TrainingFormat[] = [ 'ĐHCQ' , 'VHVL' , 'VB2' , 'LTĐH' , 'KHAC' , 'CAO ĐẲNG' , 'TRUNG CẤP' ];

export const GraduationGradingList : GraduationGrading[] = [ 'Trung bình' , 'Trung bình khá' , 'Khá' , 'Giỏi' , 'Xuất sắc' , 'KHAC' ];

export const DanhSachGioiTinh : GioTinh[] = [ 'Nam' , 'Nữ' ];
