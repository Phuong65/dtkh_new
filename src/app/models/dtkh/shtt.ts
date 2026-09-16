import { OvicFileStore } from './file-store';

export interface IntellectualProperty {
	id? : number;
	ten : string;
	thuongmai : string;
	ghichu : string;
	abstract : string;
	keywords : string;
	type : string; /*khcn/baibao/sach/congtrinh/khac/*/
	object_id : number; /*tương ứng với type là gì thì object_id là id của đối tượng đó, trường hợp = 0 là dữ liệu nhập mới*/
	params : any; /*lưu các thông tin bổ sung khác nếu dữ liệu lấy từ các bảng liên quan spkhcn*/
	files : IPFile | any;
	status : number; // 0 : chờ cập nhật hồ sơ, 1: đã cập nhật hồ sơ, 2: kết quả xét duyệt đạt, -2 : kết quả xét duyệt không đạt, 3 đã gửi hồ sơ lên cục SHTT , 4 đã cập nhật văn bằng
	donvi_id : number;
	nam_congbo : number;
	maso : string;
	capcongnhan : string;
	nhomtacgia : string;
	loai_shtt : string;
	linhvuc : string;
	mdcn_xh : number;
}

export interface IntellectualPropertyRate {
	id? : number;
	shtt_id : number;
	tendoituong : string;
	loaidoituong : string; // personal | organization
	doituong_id : number; // id nha khoa học nếu là cá nhân
	tylesohuu : number;
}

export interface ShttMeta {
	id? : number;
	shtt_id : number;
	key : string;
	title : string;
	value : string;
}

export interface ShttVanBang {
	id? : number;
	shtt_id : number;
	tenvanbang : string;
	noidung : string;
	ngaycap : string;
	noicap : string;
	ngayhethan : string;
	chusohuu : any;
	loai_shtt : string;
	files : IPFile | any;
	donvi_id : number;
}

export interface IPFile {
	record : OvicFileStore[];
	documents : OvicFileStore[];
}

export const SHTT_LINH_VUC = [
	{
		id    : 1 ,
		name  : 'Khoa học tự nhiên' ,
		order : 99
	} ,
	{
		id    : 2 ,
		name  : 'Khoa học xã hội' ,
		order : 99
	} ,
	{
		id    : 3 ,
		name  : 'Y , Sinh học' ,
		order : 99
	} ,
	{
		id    : 4 ,
		name  : 'Môi trường' ,
		order : 99
	} ,
	{
		id    : 5 ,
		name  : 'Lâm nghiệp' ,
		order : 99
	} ,
	{
		id    : 6 ,
		name  : 'Nông nghiệp' ,
		order : 99
	} ,
	{
		id    : 7 ,
		name  : 'Thủy sản' ,
		order : 99
	} ,
	{
		id    : 8 ,
		name  : 'Điện ảnh , Âm nhạc , Nghệ thuật' ,
		order : 99
	} ,
	{
		id    : 9 ,
		name  : 'Khác' ,
		order : 99
	}
];

export const SHTT_LOAI = [
	{
		id    : 1 ,
		label : 'Sáng chế' ,
		order : 99
	} ,
	{
		id    : 2 ,
		label : 'Nhãn hiệu' ,
		order : 99
	} ,
	{
		id    : 3 ,
		label : 'Kiểu dáng công nghiệp' ,
		order : 99
	} ,
	{
		id    : 4 ,
		label : 'Quyền tác giả' ,
		order : 99
	} ,
	{
		id    : 5 ,
		label : 'Bí mật thương mại' ,
		order : 99
	} ,
	{
		id    : 6 ,
		label : 'Chỉ dẫn địa lý' ,
		order : 99
	} ,
	{
		id    : 7 ,
		label : 'Thiết kế bố trí mạch tích hợp' ,
		order : 99
	}
];

export const SHTT_MUC_DO = [
	{
		value : 1 ,
		label : 'Rất thấp'
	} ,
	{
		value : 2 ,
		label : 'Thấp'
	} ,
	{
		value : 3 ,
		label : 'Trung bình'
	} ,
	{
		value : 4 ,
		label : 'Cao'
	} ,
	{
		value : 5 ,
		label : 'Rất cao'
	}
];

export const SHTT_STATE = {
	'0'  : 'Chưa đăng đăng ký bảo hộ' ,
	'1'  : 'Đã nộp đơn chờ thẩm định' ,
	'2'  : 'Đã thẩm định (đạt)' ,
	'-2' : 'Đã thẩm định (không đạt)' ,
	'3'  : 'Đã nộp hồ sơ về cục SHTT'
};

export const SHTT_THE_LOAI = {
	article  : 'article' ,
	research : 'research' ,
	book     : 'book' ,
	gen      : 'gen'
};

export const DANH_SACH_THE_LOAI_SHTT = [
	{
		name  : SHTT_THE_LOAI.article ,
		label : 'Bài báo'
	} ,
	{
		name  : SHTT_THE_LOAI.research ,
		label : 'Công trình nghiên cứu'
	} ,
	{
		name  : SHTT_THE_LOAI.gen ,
		label : 'Sản phẩm gen'
	} ,
	{
		name  : SHTT_THE_LOAI.book ,
		label : 'Sách, tạp chí'
	}
];
