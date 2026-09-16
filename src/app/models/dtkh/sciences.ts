import { OvicFileStore } from './file-store';

export interface Scientist {
	id? : number;
	hovaten : string;
	ten : string;
	namsinh : number;
	noisinh : string;
	dantoc : string;
	gioitinh : string;
	hocham : string;
	hocvi : string;
	nam_hocvi : number;
	nam_bo_nhiem : number;
	nuoc_chungnhan : string;
	chucvu : string;
	linhvuc_nghiencuu : any;
	chuyennganh : string;
	chuyenganh_khac : string;
	diachi_noio : string;
	email : string;
	phone : string;
	password : string;
	anh4x6 : string;
	cmnd_hochieu : string;
	masothue : string;
	donvi_id : number;
	donvi_chuyenmon_id : number;
	quoctich : string;
}

export interface TrainingResult {
	id : number;
	nhakhoahoc_id : number;
	nam : number; /*Năm đào tạo*/
	ths : number; /*Số lượng thạc sỹ*/
	ncs : number; /*Số lượng nghiên cứu sinh*/
	ghichu : string;
	khcn_id? : number; /*Thực hiện ở công trình khoa học nào nếu không = 0*/
}

export interface Education {
	id : number;
	nkh_id : number;
	bacdaotao : string;
	hedaotao : string;
	nganh : string;
	noidaotao : string;
	namtotnghiep : number;
	quocgia : string;
}

export interface Certificate {
	id : number;
	nkh_id : number;
	loai : 'TH' | 'NN';	/*TH-NN*/
	ten : string;	/*Nếu là tin học thi ghi: trình độ tin học, nếu là ngoại ngữ thì ghi tên goại ngữ vd: Tiếng Anh, Tiếng Pháp...*/
	trinhdo : string;
}

export interface Award {
	id : number;
	nkh_id : number;
	ten : string; /*Tên giải thưởng*/
	noidungkhen : string; /*Mô tả nội dung khen thưởng*/
	nam : number; /*năm được khen*/
	files : OvicFileStore[];
}

export interface WorkingProcess {
	id : number;
	nkh_id : number;
	thoigian : string;	/*từ tháng năm - đên tháng năm*/
	noicongtac : string;
	mota : string;
	ordering : number;
}

export interface Gene {
	id : number;
	slug? : string;
	nhakhoahoc_id : number;
	dongtacgia_ids : string;
	nhomtacgia : string;
	ten : string;
	maso : string;
	danhmuc_gen : string;
	capcongnhan : string;
	nam_congbo : number;
	abstract : string;
	keywords : string;
	ghichu : string;
	khcn_id : number;
	files : any;
	donvi_id : number;
	shtt_state : number;
	shtt_id : number;
}

export interface Book {
	id? : number;
	slug? : string;
	nhakhoahoc_id : number;
	dongtacgia_ids : string;
	nhomtacgia : string;
	ten : string;
	nha_xb : string;
	nam_xb : number;
	isbn_code : string; /* Mã sách */
	sotrang : string;
	abstract : string;
	ngon_ngu : string;
	files : any;
	params : string;
	ghichu : string;
	keywords : string;
	dongia : number;
	khcn_id? : number;
	shtt_state : number;
	shtt_id : number;
}

export interface ScientificReport {
	donvi_id : number;
	id? : number;
	slug? : string;
	nhakhoahoc_id? : number;
	dongtacgia_ids? : string; /*Lưu các id nhà khoa học tham gia: |1|2|3|...*/
	nhomtacgia? : string;
	ten : string;
	nha_xb : string;
	nam_xb : number;
	ten_tapchi : string;
	tap : string;
	so : string;
	trang : string;
	isi_scopus : string; /*SCI; SCIE; SSCI; A&HCI; CPCI; SCOPUS; OTHER\\n (0 là báo trong nước)*/
	abstract : string; /*mô tả*/
	keywords : string;
	files : any; /*id => tên file*/
	params : string;
	issn_code : string; /* Mã số tạp chí */
	if : string; /* chỉ số IF */
	rank : string; /* chỉ số xếp hạng: Q1, Q2, Q3, Q4 */
	ghichu : string;
	khcn_id : number; /* bai bao la san pham cua cong trinh khoa hoc nao? =0 ko thuoc cong trinh khcn nao */
	shtt_state : number;
	shtt_id : number;
}

export interface Project {
	id? : number;
	slug? : string;
	nhakhoahoc_id : number;
	dongtacgia_ids : string;
	nhomtacgia : string;
	ten : string;
	cap_congnhan : string;
	nam_congbo : number;
	phamvi : string;
	diachi_ungdung : string;
	maso : string;
	abstract : string;
	linhvuc_nghiencuu : string;
	khcn_id? : number;
	files : any;
	donvi_id : number;
	keywords : string;
	params? : string;
	shtt_state : number;
	shtt_id : number;
}

