# Plan: Sửa menu quyền Đào tạo không click được

## Context

API trả về menu quyền dạng phẳng. Quan hệ cha-con nằm trong `id`: ví dụ `dao-tao_quanly-noidung` là nhóm cha, `dao-tao_quanly-noidung_chuongtrinh-daotao` là mục con. Hiện menu không phản hồi khi nhấn vì `AuthenticationService.userMenu` chỉ xử lý `child` đã lồng sẵn; menu phẳng không được dựng thành cây. Ngoài ra component điều hướng đang luôn tìm child đầu tiên thay vì xử lý đúng URL, còn template ưu tiên `item.icon` từ API (`fa fa-angle-right`) thay vì icon SVG nội bộ.

Mục tiêu: đọc đúng menu phẳng, nhóm đúng menu cha-con, click điều hướng đến các route `/admin/daotao_ld/...`, giữ `pms`, dùng icon từ `public/fonts/custom-icon.svg`.

## Implementation plan

### 1. Chuẩn hóa menu và icon

Sửa `src/app/services/authentication.service.ts`, quanh `userMenu` (dòng 200-224):

- Giữ nguyên menu đã có `child`, chỉ chuẩn hóa URL/ID.
- Với menu phẳng, xác định parent bằng cách tìm item cha thực sự tồn tại trong danh sách; đưa item dạng `parent_child` vào `parent.child`.
- Không tách ID mù quáng theo dấu `_`; mục không có parent hợp lệ giữ ở root.
- Giữ dữ liệu `pms` trên từng menu.
- Chuẩn hóa ID/URL sao cho khớp route thực tế và guard, không làm hỏng `getUserPermission()`.
- Bỏ icon API khỏi dữ liệu hiển thị; map sang symbol có thật trong `public/fonts/custom-icon.svg`, gồm:
  - `custom-folder-open-2`
  - `custom-graduation-cap`
  - `custom-book-open`
  - `custom-document-text`
  - `custom-clipboard`
  - `custom-calendar`
  - `custom-chalkboard-user`
  - `custom-users-gear`
  - `custom-angle-right` làm mặc định.
- Không làm mất menu nội bộ `account` và `thong-bao` đang dùng `customSvg`.

### 2. Sửa điều hướng menu cha

Sửa `src/app/theme/layouts/menu/ictu-vertical-menu/ictu-vertical-menu.component.ts`, hàm `activeMenu()`:

- Menu có `url`: điều hướng trực tiếp đến URL đó.
- Menu chỉ có child: chọn child đầu tiên có URL.
- Không hard-code `daotao_ld`; dùng URL đã chuẩn hóa theo route hiện tại.
- Cập nhật `menuActivated` sau khi xử lý để nhóm đang chọn hiển thị đúng child.
- Không ghép lặp tiền tố `/admin/daotao_ld`.

### 3. Dùng icon nội bộ

Sửa:

- `src/app/theme/layouts/menu/ictu-vertical-menu/ictu-vertical-menu.component.html`
- `src/app/theme/layouts/menu/ictu-vertical-menu/ictu-menu-item/ictu-menu-item.component.html`

Quy tắc render:

1. Ưu tiên `customSvg` với `fonts/custom-icon.svg#...`.
2. Nếu thiếu icon, dùng `custom-angle-right`.
3. Không render `item.icon` từ API để `fa fa-angle-right` không xuất hiện.

Giữ `routerLinkActive`, nested child, external link và responsive behavior hiện có. Dùng URL đã chuẩn hóa, tránh ghép tiền tố hai lần.

### 4. Kiểm tra guard và quyền

Đối chiếu:

- `src/app/guards/admin-module.guard.ts`
- `src/app/guards/admin-module-child.guard.ts`
- `src/app/pages/admin/admin-routing.module.ts`
- `src/app/pages/admin/children/dao-tao/dao-tao-routing.module.ts`

Nếu ID sau chuẩn hóa không khớp guard, sửa guard để so sánh route đã bỏ tiền tố `/admin/` với ID menu chuẩn hóa. Không tạo ID giả làm hỏng permission. Bảo đảm các route sau được cho phép:

- `/admin/daotao_ld/chuongtrinh-daotao`
- `/admin/daotao_ld/quanly-monhoc`
- `/admin/daotao_ld/tai-lieu`
- `/admin/daotao_ld/lop-hoc-phan`

Kiểm tra `getUserPermission()` vẫn lấy đúng `pms` từ payload phẳng.

### 5. Kiểm thử

- Chạy `npm run build`.
- Chạy `npm run lint` nếu project lint được.
- Với payload mẫu gồm `dao-tao_quanly-noidung` và `dao-tao_quanly-lophocphan`, xác nhận `userMenu` tạo đúng parent/child.
- Click parent: nhóm mở, điều hướng child đầu tiên khi phù hợp.
- Click child: URL đổi, component tương ứng render.
- Refresh từng route: parent/child vẫn active.
- Xác nhận icon lấy từ `custom-icon.svg`, không còn icon API.
- Xác nhận `pms: [1,1,1,1]` vẫn bật view/create/update/delete.
