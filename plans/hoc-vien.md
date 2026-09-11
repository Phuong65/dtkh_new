# Plan: migrate hoc-vien lên Angular 20/21

## Context
`src/app/components/hoc-vien/` là component Angular 14 cũ, phụ thuộc nhiều model/service/component đã bị loại bỏ (`@core/*`, `@shared/*`, `ovic-table`, `ovic-dropdown`, ng-bootstrap và PrimeNG API cũ). Route `/dao-tao/quanly-hocvien` hiện tải page component rỗng. Mục tiêu: migrate component học viên sang kiến trúc hiện tại, dùng `IctuDataTable2` để hiển thị, `IctuFormControl2` + PrimeNG Drawer cho form nhập, hỗ trợ CUD và thay đổi trạng thái.

## Phạm vi
- Giữ: danh sách phân trang 20 dòng, tìm kiếm, thêm, sửa, xóa đơn/hàng loạt, bật/tắt trạng thái.
- Bỏ: import Excel, xem lớp học phần, đồng bộ cache, reset mật khẩu, progress xóa cũ.
- API: endpoint `student` theo lựa chọn của người dùng.
- `src/app/pages/admin/children/dao-tao/children/quanly-hocvien/` là wrapper gọi `<app-hoc-vien>`.

## Thực hiện
1. Thêm `Student` vào `src/app/models/user.ts` với dữ liệu API cũ: `id`, `hoten`, `ten`, `ngaysinh`, `gioitinh`, `email`, `phone`, `diachi`, `status`, `student_code`, `user_id` và các trường tùy chọn.
2. Tạo `src/app/services/student.service.ts`, kế thừa `IctuBaseServiceClass<Student>`, endpoint `student`.
3. Viết lại `src/app/components/hoc-vien/hoc-vien.component.ts`:
   - Standalone Angular hiện tại.
   - `IctuDataTable2<Student>({ rows: 20, pageLinkSize: 5 })`.
   - `IctuFormControl2<Student>` cho form thêm/sửa.
   - Signal loading/error, query phân trang/tìm kiếm, CUD, xóa nhiều, toggle status, unsubscribe khi destroy.
4. Viết lại `src/app/components/hoc-vien/hoc-vien.component.html`:
   - Native table + `@for`/`@empty`, checkbox Material, `ictu-paginator`.
   - Các cột: mã học viên, họ tên, ngày sinh, giới tính, email, điện thoại, trạng thái, hành động.
   - Drawer form: họ tên, tên, mã học viên, ngày sinh, giới tính, email, điện thoại, địa chỉ, trạng thái.
5. Thu gọn CSS legacy còn các style cần thiết cho component mới.
6. Cập nhật page wrapper `quanly-hocvien.component.ts/html` để import và render `HocVienComponent`; giữ nguyên route hiện tại.

## Verification
- Chạy `npm run build` để kiểm tra TypeScript, template AOT và lazy route.
- Chạy `git diff --check`.
- Smoke test `/dao-tao/quanly-hocvien`: tải bảng, phân trang, tìm kiếm, thêm/sửa/xóa, đổi trạng thái.