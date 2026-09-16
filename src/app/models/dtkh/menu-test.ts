
export const MENU_TEST_V2 = [
    {
        id: "giang-vien",
        url: "giang-vien",
        title: "Giảng viên",
        icon: "fa-solid fa-chalkboard-user",
        type: "group",
        child: [{
            id: "giang-vien_quanly-giangday",
            title: "Quản lý giảng dạy",
        },
        {
            id: "giang-vien_quanly-giangday_lich-giang-day",
            url: "lich-giang-day",
            title: "Lịch giảng dạy",
            icon: "fa fa-angle-right",
        },
        {
            id: "giang-vien_quanly-giangday_lop-hoc-phan",
            url: "lop-hoc-phan",
            title: "Lớp học phần",
            icon: "fa fa-angle-right",
        },
        {
            id: "giang-vien_quanly-giangday_tai-lieu",
            url: "tai-lieu",
            title: "Tệp tin",
            icon: "fa fa-angle-right",
        },
        {
            id: "giang-vien_quanly-noidung",
            title: "Quản lý nội dung",
        },
        {
            id: "giang-vien_quanly-noidung_kehoach-hoctap",
            url: "kehoach-hoctap",
            title: "Cây CELO",
            icon: "fa fa-angle-right",
        },
        {
            id: "giang-vien_quanly-noidung_cauhoi-tracnghiem",
            url: "cauhoi-tracnghiem",
            title: "Câu hỏi trắc nghiệm",
            icon: "fa fa-angle-right",
        },
        {
            id: "giang-vien_quanly-noidung_cauhoi-thuchanh",
            url: "cauhoi-thuchanh",
            title: "Đề/Câu hỏi Thực hành",
            icon: "fa fa-angle-right",
        },
        {
            id: "giang-vien_quanly-noidung_giang-vien-test",
            url: "giang-vien-test",
            title: "Test bộ câu hỏi TN",
            icon: "fa fa-angle-right",
        },
        {
            id: "giang-vien_hotro-sinhvien",
            title: "Hỗ trợ sinh viên",
        },
        {
            id: "giang-vien_hotro-sinhvien_traloi-sinhvien",
            url: "traloi-sinhvien",
            title: "Trả lời sinh viên",
            icon: "fa fa-angle-right",
        },
        {
            id: "giang-vien_hotro-sinhvien_thongbao-sinhvien",
            url: "thongbao-sinhvien",
            title: "Thông báo sinh viên",
            icon: "fa fa-angle-right",
        },
        ]
    },
    {
        id: "chu-nhiem",
        url: "chu-nhiem",
        title: "Chủ nhiệm",
        icon: "fa-solid fa-tags",
    },
    {
        id: "khao-thi",
        url: "khao-thi",
        title: "Khảo thí",
        icon: "fa-solid fa-scale-balanced",
        type: "group",
        child: [{
            id: "khao-thi_nganhang-cauhoi",
            title: "Ngân hàng câu hỏi",
        },
        {
            id: "khao-thi_nganhang-cauhoi_cauhoi-tracnghiem",
            url: "cauhoi-tracnghiem",
            title: "Câu hỏi trắc nghiệm",
            icon: "fa fa-angle-right",

        },
        {
            id: "khao-thi_nganhang-cauhoi_cauhoi-thuchanh",
            url: "cauhoi-thuchanh",
            title: "Đề/Câu hỏi Thực hành",
            icon: "fa fa-angle-right",

        },
        {
            id: "khao-thi_nganhang-cauhoi_tao-cautrucde",
            url: "tao-cautrucde",
            title: "Form đề Trắc nghiệm",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_quanly-thikthp",
            title: "Quản lý thi KTHP",
        },
        {
            id: "khao-thi_quanly-thikthp_tao-cathi-tn",
            url: "tao-cathi-tn",
            title: "Tạo ca thi TN",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_quanly-thikthp_theodoi-cathi",
            url: "theodoi-cathi",
            title: "Coi thi",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_quanly-thikthp_tao-cathi-th",
            url: "tao-cathi-th",
            title: "Tạo ca thi TH",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_quanly-thikthp_thongke-cathi",
            url: "thongke-cathi",
            title: "Tổng hợp kết quả",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_saoluu-ketqua",
            title: "Sao lưu kết quả",
        },
        {
            id: "khao-thi_saoluu-ketqua_xuat-baithi",
            url: "xuat-baithi",
            title: "Tải dữ liệu thi",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_saoluu-ketqua_xoa-dulieuthi",
            url: "xoa-dulieuthi",
            title: "Xóa dữ liệu thi",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_baocao-thongke",
            title: "Báo cáo thống kê",
        },
        {
            id: "khao-thi_baocao-thongke_tanxuat-sudung",
            url: "tanxuat-sudung",
            title: "Tần xuất sử dụng",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_baocao-thongke_bieudo-phodiem",
            url: "bieudo-phodiem",
            title: "Biểu đồ phổ điểm",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_nhatky-logs",
            title: "Nhật ký logs",
        },
        {
            id: "khao-thi_nhatky-logs_tracuu-logs",
            url: "tracuu-logs",
            title: "Tra cứu logs",
            icon: "fa fa-angle-right",
        },
        {
            id: "khao-thi_nhatky-logs_xoa-logs",
            url: "xoa-logs",
            title: "Xóa logs",
            icon: "fa fa-angle-right",
        },
        ]
    },
    {
        id: "dao-tao",
        url: "dao-tao",
        title: "Đào tạo",
        icon: "fa-solid fa-calendar-check",
        type: "group",
        child: [{
            id: "dao-tao_quanly-noidung",
            title: "Quản lý nội dung",
        },
        {
            id: "dao-tao_quanly-noidung_kehoach-hoctap",
            url: "kehoach-hoctap",
            title: "Môn học",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-noidung_cauhoi-tracnghiem",
            url: "cauhoi-tracnghiem",
            title: "Câu hỏi trắc nghiệm",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-noidung_cauhoi-thuchanh",
            url: "cauhoi-thuchanh",
            title: "Đề/Câu hỏi Thực hành",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-noidung_quanly-noidung-decuong",
            url: "quanly-noidung-decuong",
            title: "Đề cương môn học",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-noidung_tai-lieu",
            url: "tai-lieu",
            title: "Tệp tin",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-lophocphan",
            title: "Quản lý lớp học phần",
        },
        {
            id: "dao-tao_quanly-lophocphan_lop-hoc-phan",
            url: "lop-hoc-phan",
            title: "Danh sách lớp",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-lophocphan_dongbo-dulieu",
            url: "dongbo-dulieu",
            title: "Đồng bộ dữ liệu",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-thongbao",
            title: "Quản lý thông báo",
        },
        {
            id: "dao-tao_quanly-thongbao_thongbao-giangvien",
            url: "thongbao-giangvien",
            title: "Thông báo giảng viên",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-thongbao_thongbao-sinhvien",
            url: "thongbao-sinhvien",
            title: "Thông báo sinh viên",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-danhmuc",
            title: "Quản lý danh mục",
        },
        {
            id: "dao-tao_quanly-danhmuc_khoa",
            url: "khoa",
            title: "Danh mục đơn vị",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-danhmuc_nganh",
            url: "nganh",
            title: "Danh mục ngành",
            icon: "fa fa-angle-right",
        },
        {
            id: "dao-tao_quanly-danhmuc_bomon",
            url: "bomon",
            title: "Danh mục bộ môn",
            icon: "fa fa-angle-right",
        },
        ]
    },
    {
        id: "cthssv",
        url: "cthssv",
        title: "CTHSSV",
        icon: "fa-solid fa-users-gear",
        type: "group",
        child: [{
            id: "cthssv_quanly-sinhvien",
            title: "Quản lý sinh viên",
        },
        {
            id: "cthssv_quanly-sinhvien_khoa-lop",
            url: "khoa-lop",
            title: "Khoa - Lớp",
            icon: "fa fa-angle-right",
        },
        {
            id: "cthssv_quanly-sinhvien_quanly-hocvien",
            url: "quanly-hocvien",
            title: "Danh sách sinh viên",
            icon: "fa fa-angle-right",
        },
        {
            id: "cthssv_quanly-sinhvien_dongbo-dulieu-sinhvien",
            url: "dongbo-dulieu-sinhvien",
            title: "Đồng bộ dữ liệu SV",
            icon: "fa fa-angle-right",
        },
        {
            id: "cthssv_quanly-gvcn",
            title: "Quản lý GVCN",
        },
        {
            id: "cthssv_quanly-gvcn_danhsach-gvcn",
            url: "danhsach-gvcn",
            title: "Danh sách GVCN",
            icon: "fa fa-angle-right",
        },
        ]
    },
    {
        id: "lanhdao-khoa",
        url: "lanhdao-khoa",
        title: "LĐ. Khoa",
        icon: "fa-solid fa-clipboard-check",
        type: "group",
        child: [{
            id: "lanhdao-khoa_quanly-noidung",
            title: "Quản lý nội dung",
        },
        {
            id: "lanhdao-khoa_quanly-noidung_kehoach-hoctap",
            url: "kehoach-hoctap",
            title: "Cây CELO",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-khoa_quanly-noidung_cauhoi-tracnghiem",
            url: "cauhoi-tracnghiem",
            title: "Câu hỏi trắc nghiệm",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-khoa_quanly-noidung_cauhoi-thuchanh",
            url: "cauhoi-thuchanh",
            title: "Đề/Câu hỏi Thực hành",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-khoa_quanly-noidung_quanly-noidung-decuong",
            url: "quanly-noidung-decuong",
            title: "Đề cương môn học",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-khoa_quanly-noidung_tai-lieu",
            url: "tai-lieu",
            title: "Tệp tin",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-khoa_quanly-lophocphan",
            title: "Quản lý lớp học phần",
        },
        {
            id: "lanhdao-khoa_quanly-lophocphan_lop-hoc-phan",
            url: "lop-hoc-phan",
            title: "Danh sách lớp",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-khoa_quanly-lophocphan_dongbo-dulieu",
            url: "dongbo-dulieu",
            title: "Đồng bộ dữ liệu",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-khoa_quanly-thongbao",
            title: "Quản lý thông báo",
        },
        {
            id: "lanhdao-khoa_quanly-thongbao_thongbao-giangvien",
            url: "thongbao-giangvien",
            title: "Thông báo giảng viên",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-khoa_quanly-thongbao_thongbao-sinhvien",
            url: "thongbao-sinhvien",
            title: "Thông báo sinh viên",
            icon: "fa fa-angle-right",
        },
        ]
    },
    {
        id: "lanhdao-bomon",
        url: "lanhdao-bomon",
        title: "LĐ. Bộ môn",
        icon: "fa-solid fa-book-open-reader",
        type: "group",
        child: [{
            id: "lanhdao-bomon_quanly-noidung",
            title: "Quản lý nội dung",
        },
        {
            id: "lanhdao-bomon_quanly-noidung_kehoach-hoctap",
            url: "kehoach-hoctap",
            title: "Cây CELO",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-bomon_quanly-noidung_cauhoi-tracnghiem",
            url: "cauhoi-tracnghiem",
            title: "Câu hỏi trắc nghiệm",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-bomon_quanly-noidung_cauhoi-thuchanh",
            url: "cauhoi-thuchanh",
            title: "Đề/Câu hỏi Thực hành",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-bomon_quanly-noidung_quanly-noidung-decuong",
            url: "quanly-noidung-decuong",
            title: "Đề cương môn học",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-bomon_quanly-noidung_tai-lieu",
            url: "tai-lieu",
            title: "Tệp tin",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-bomon_quanly-lophocphan",
            title: "Quản lý lớp học phần",
        },
        {
            id: "lanhdao-bomon_quanly-lophocphan_lop-hoc-phan",
            url: "lop-hoc-phan",
            title: "Danh sách lớp",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-bomon_quanly-lophocphan_dongbo-dulieu",
            url: "dongbo-dulieu",
            title: "Đồng bộ dữ liệu",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-bomon_quanly-thongbao",
            title: "Quản lý thông báo",
        },
        {
            id: "lanhdao-bomon_quanly-thongbao_thongbao-giangvien",
            url: "thongbao-giangvien",
            title: "Thông báo giảng viên",
            icon: "fa fa-angle-right",
        },
        {
            id: "lanhdao-bomon_quanly-thongbao_thongbao-sinhvien",
            url: "thongbao-sinhvien",
            title: "Thông báo sinh viên",
            icon: "fa fa-angle-right",
        },
        ]
    },
    {
        id: "hoi-dong",
        url: "hoi-dong",
        title: "Hội đồng",
        icon: "fa-solid fa-pen-to-square",
        type: "group",
        child: [{
            id: "hoi-dong_duyetnoidung-monhoc",
            title: "Duyệt nội dung môn học",
        },
        {
            id: "hoi-dong_duyetnoidung-monhoc_capkhoa",
            url: "duyetnoidung-hoctap",
            title: "Duyệt nội dung cấp Khoa",
            icon: "fa fa-angle-right",
        },
        {
            id: "hoi-dong_duyetnoidung-monhoc_capkhoa",
            url: "duyetnoidung-hoctap-captruong",
            title: "Duyệt nội dung cấp Trường",
            icon: "fa fa-angle-right",
        },
        ]
    },
    {
        id: "bao-cao",
        url: "bao-cao",
        title: "Báo cáo",
        icon: "fa-solid fa-chart-pie",
        type: "group",
        child: [{
            id: "bao-cao_thongke-solieu-tonghop",
            title: "Thống kê số liệu tổng hợp",
        },
        {
            id: "bao-cao_thongke-solieu-tonghop_caycelo-noidungkhac",
            url: "caycelo-noidungkhac",
            title: "Kết quả nghiệm thu cây CELO và nội dung khác",
            icon: "fa fa-angle-right",
        },
        {
            id: "bao-cao_thongke-solieu-tonghop_ketquatest-nghiemthucauhoi",
            url: "ketquatest-nghiemthucauhoi",
            title: "Kết quả nghiệm thu câu hỏi",
            icon: "fa fa-angle-right",
        },
        {
            id: "bao-cao_thongke-solieu-tonghop_ketquatest-nghiemthucauhoi-kthp",
            url: "ketquatest-nghiemthucauhoi-kthp",
            title: "Kết quả nghiệm thu câu hỏi KTHP(TN)",
            icon: "fa fa-angle-right",
        },
        {
            id: "bao-cao_thongke-solieu-tonghop_ketquatest-nghiemthucauhoituluan-kthp",
            url: "ketquatest-nghiemthucauhoituluan-kthp",
            title: "Kết quả nghiệm thu câu hỏi KTHP(TH)",
            icon: "fa fa-angle-right",
        },
        {
            id: "bao-cao_thongke-solieu-tonghop_ketquatest-sinhvien",
            url: "ketquatest-sinhvien",
            title: "Kết quả test sinh viên",
            icon: "fa fa-angle-right",
        },
        {
            id: "bao-cao_thongke-solieu-tonghop_ketqua-testtuan-sinhvien",
            url: "ketqua-testtuan-sinhvien",
            title: "Kết quả test tuần sinh viên",
            icon: "fa fa-angle-right",
        },
        ]
    },
    {
        id: "bgh",
        url: "bgh",
        title: "BGH",
        icon: "fa-solid fa-chart-column",
        type: "group",
        child: []
    },
    {
        id: "lanhdao-truong",
        url: "lanhdao-truong",
        title: "ADMIN",
        icon: "fa-solid fa-gears",
        type: "group",
        child: []
    },
    {
        id: "he-thong",
        url: "he-thong",
        title: "Hệ thống",
        icon: "fa-solid fa-gears",
        type: "group",
        child: [{
            id: "he-thong_quanly-hethong",
            title: "Quản lý hệ thống",
        },
        {
            id: "he-thong_quanly-hethong_quan-ly-tai-khoan",
            url: "quan-ly-tai-khoan",
            title: "Tài khoản giảng viên",
            icon: "fa fa-angle-right",
        },
        {
            id: "he-thong_quanly-hethong_quanly-hocvien",
            url: "quanly-hocvien",
            title: "Tài khoản sinh viên",
            icon: "fa fa-angle-right",
        },
        {
            id: "he-thong_quanly-hethong_cai-dat",
            url: "cai-dat",
            title: "Thiết lập hệ thống",
            icon: "fa fa-angle-right",
        },
        {
            id: "he-thong_quanly-hethong_thong-tin-tai-khoan",
            url: "thong-tin-tai-khoan",
            title: "Hồ sơ của bạn",
            icon: "fa fa-angle-right",
        },
        {
            id: "he-thong_quanly-hethong_trogiup-kythuat",
            url: "trogiup-kythuat",
            title: "Trợ giúp kỹ thuật",
            icon: "fa fa-angle-right",
        }]
    }
]

const setting = {
    "test": {
        "ADDITIONAL":
        {
            "review": "answers",
            "maxTestTimes": 0,
            "percentComplete": 80
        },
        "SCHEDULED":
        {
            "review": "no"
        }
    },
    "plan":
        { "prefix": "Bài" },
    "form_question": { "unlimit": true }
}
