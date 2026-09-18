# Plan: Nhận biết Role thông qua Menu thay vì API Permission Roles

## 1. Bối cảnh & Mục tiêu

### Hiện trạng
- Backend trả về payload `/permission` gồm 2 mảng:
  - `roles: PickRole[]`: Danh sách role tĩnh (`administrator`, `daotao_ld`, `teacher`,...).
  - `menus: IctuNavigation[]`: Cây/danh sách menu được cấp quyền, mỗi menu có `pms: [view, create, update, delete]`.
- Hệ thống đang dùng `auth.roles`, `auth.userHasRole()`, `auth.maxPowerRoleUser()` dựa trên `permission.data.roles` để:
  - Phân quyền điều hướng khi đăng nhập (`login.component.ts`, `redirect-uri-call-back.ts`).
  - Gán role cứng thông qua `ROLE_PROVIDER` tại `AdminModule` (`administrator`), `DaoTaoModule` (`daotao_ld`).
  - Kiểm tra quyền trong các component (ví dụ: `monhoc-kiemtra-danhgia.component.ts`, `cauhoi-tracnghiem-manager.component.ts`) bằng cách kiểm tra string role (`roles.includes('daotao_ld')`).

### Nhược điểm của cách cũ
- Role từ `roles` không phản ánh chính xác các module/menu mà người dùng thực tế được giao thao tác.
- Module level role provider (`ROLE_PROVIDER`) gán cứng một role duy nhất cho cả feature module, không linh hoạt khi một user có nhiều vai trò hoặc menu phân mảnh.
- Không đồng bộ: user có thể có role trong `roles` nhưng không có menu tương ứng, hoặc ngược lại.

### Mục tiêu
- **Nhận biết role và quyền hạn thông qua danh sách `menus` thực tế** thay vì mảng `roles` của API permission.
- Loại bỏ sự phụ thuộc vào `ROLE_PROVIDER` và `PROVIDED_ROLE`.
- Toàn bộ việc điều hướng, routing guards, và hiển thị tính năng trong component đều căn cứ vào menu URL/ID hoặc permission action (`view`, `create`, `update`, `delete`) gắn liền với menu đó.

---

## 2. Quy tắc suy diễn Role từ Menu

Mỗi menu item trong hệ thống có `id` hoặc `url` mang tiền tố nghiệp vụ:
- `dao-tao` hoặc `daotao_ld` -> Role **`daotao_ld`** (Lãnh đạo/Trợ lý Đào tạo)
- `lanhdao-truong` -> Role **`truong_ld`** (Lãnh đạo Trường)
- `khoa` hoặc `khoa_ld` -> Role **`khoa_ld`** (Lãnh đạo Khoa)
- `bomon` hoặc `bomon_ld` -> Role **`bomon_ld`** (Lãnh đạo Bộ môn)
- `khaothi` hoặc `khaothi_ld` -> Role **`khaothi_ld`** (Khảo thí)
- `cthssv` hoặc `cthssv_ld` -> Role **`cthssv_ld`** (Công tác HSSV)
- `giang-vien` hoặc `teacher` -> Role **`teacher`** (Giảng viên)
- Menu quản trị hệ thống (`administrator`, `user-manager`, `sys-configs`,...) -> Role **`administrator`**

Khi đăng nhập, xác định route đích bằng menu có quyền cao nhất mà user sở hữu (dựa trên mức ưu tiên):
1. `administrator` -> `/admin/dashboard`
2. `truong_ld` -> `/admin/lanhdao-truong/dashboard`
3. `daotao_ld` -> `/admin/daotao_ld/dashboard`
4. Các vai trò khác -> URL của dashboard tương ứng hoặc URL của menu con đầu tiên khả dụng.

---

## 3. Các bước thực hiện chi tiết

### Bước 1: Cập nhật `AuthenticationService` (`src/app/services/authentication.service.ts`)
1. **Xây dựng hàm phân tích role từ menu:**
   - Thêm `getUserRolesFromMenu(): SysRoleName[]`: Duyệt qua `userMenu`, trích xuất prefix/module name từ `url` và `id`, ánh xạ thành danh sách `SysRoleName`.
   - Thêm `hasRole(role: SysRoleName | SysRoleName[]): boolean`: Kiểm tra xem user có quyền thuộc role đó không dựa vào `getUserRolesFromMenu()`.
2. **Cập nhật / Deprecate các phương thức cũ:**
   - Đổi `userHasRole(roleNames)` sang sử dụng kết quả từ `getUserRolesFromMenu()`.
   - Cập nhật `maxPowerRoleUser()`: Trả về role có thứ bậc cao nhất suy ra từ `getUserRolesFromMenu()` thay vì `this.permission.data.roles`.
   - Giữ lại `getUserPermission(route)` vì hàm này vốn đã đọc theo menu `pms: [view, create, update, delete]`.
3. **Thêm helper kiểm tra quyền nhanh:**
   - `canAccess(route: string, action?: 'view' | 'create' | 'update' | 'delete'): boolean`.

### Bước 2: Loại bỏ `ROLE_PROVIDER` và `PROVIDED_ROLE`
1. **Xóa `src/app/providers/admin-role.provider.ts`**:
   - Không còn cung cấp role tĩnh qua Angular InjectionToken.
2. **Xóa khai báo provider tại các module:**
   - `src/app/pages/admin/admin.module.ts`: Xóa `providers: [ ROLE_PROVIDER.administrator ]`.
   - `src/app/pages/admin/children/dao-tao/dao-tao.module.ts`: Xóa `providers: [ ROLE_PROVIDER.daotao_ld ]`.

### Bước 3: Cập nhật điều hướng sau Đăng nhập
1. **`src/app/pages/auth/login/login.component.ts`**:
   - Sửa `redirectAfterAuthenticated()`:
     - Lấy danh sách menu thông qua `auth.userMenu`.
     - Tìm menu dashboard ưu tiên nhất hoặc menu đầu tiên người dùng được phép truy cập.
     - Điều hướng thẳng tới route đó mà không cần tra cứu map `APP_REDIRECT_LINKS` theo `roles` của API.
2. **`src/app/pages/auth/redirect-uri-call-back/redirect-uri-call-back.ts`**:
   - Cập nhật logic tương tự login component.

### Bước 4: Cập nhật Routing Guards
- `src/app/guards/admin.guard.ts`: Đảm bảo kiểm tra user đã login và có ít nhất 1 menu (`auth.userMenu.length > 0`).
- `src/app/guards/admin-module.guard.ts`: Tiếp tục duy trì `auth.userCanAccessRoute(state.url)`.
- `src/app/guards/admin-module-child.guard.ts`: Tiếp tục duy trì kiểm tra route con khớp với menu `child`.

### Bước 5: Cập nhật các Component đang kiểm tra `auth.roles`
Chuyển đổi logic kiểm tra role trong các component từ đọc `auth.roles` sang dùng `getUserRolesFromMenu()` hoặc `getUserPermission()`:
1. `src/app/components/course-detail/children/monhoc-kiemtra-danhgia/monhoc-kiemtra-danhgia.component.ts`:
   - Hàm `setupPermissions()`:
     - Thay `this.auth.roles.map(...)` bằng `this.auth.getUserRolesFromMenu()`.
     - Quyền hành động (thêm, sinh đề, xóa đề) ưu tiên kiểm tra `permissionControl` hoặc `auth.getUserPermission(...)`.
2. `src/app/components/dtkh/cauhoi-trachnghiem/cauhoi-tracnghiem-manager/cauhoi-tracnghiem-manager.component.ts`
3. `src/app/components/dtkh/cauhoi-trachnghiem/cauhoi-tracnghiem-chitiet/cauhoi-tracnghiem-chitiet.component.ts`
4. `src/app/components/course-detail/children/monhoc-thongtin/monhoc-thongtin.component.ts`
5. `src/app/components/course-detail/children/monhoc-cauhinh/monhoc-cauhinh.component.ts`
6. `src/app/components/hoc-vien/hoc-vien.component.ts`
7. `src/app/components/danh-muc/training-mode/training-mode.component.ts`

### Bước 6: Cập nhật Model `role.ts` (`src/app/models/role.ts`)
- Giữ lại `SysRoleName` định nghĩa danh mục tên role phục vụ so khớp và điều hướng.
- Loại bỏ các type/hàm thừa nếu không còn được sử dụng ở bất kỳ đâu (`createDefaultDashboardMenus`,...).

---

## 4. Danh sách các file tác động chính

| STT | File | Hành động |
|-----|------|-----------|
| 1 | `src/app/services/authentication.service.ts` | Thêm `getUserRolesFromMenu()`, chỉnh `userHasRole()`, `maxPowerRoleUser()` |
| 2 | `src/app/providers/admin-role.provider.ts` | **Xóa file** |
| 3 | `src/app/pages/admin/admin.module.ts` | Xóa `ROLE_PROVIDER` khỏi providers |
| 4 | `src/app/pages/admin/children/dao-tao/dao-tao.module.ts` | Xóa `ROLE_PROVIDER` khỏi providers |
| 5 | `src/app/pages/auth/login/login.component.ts` | Điều hướng login dựa theo menu khả dụng |
| 6 | `src/app/pages/auth/redirect-uri-call-back/redirect-uri-call-back.ts` | Đồng bộ logic điều hướng theo menu |
| 7 | `src/app/models/role.ts` | Dọn dẹp các interface và logic role cứng |
| 8 | `src/app/components/course-detail/children/monhoc-kiemtra-danhgia/monhoc-kiemtra-danhgia.component.ts` | Đổi `setupPermissions()` sang menu-based |
| 9 | Các component liên quan khác (`cauhoi-tracnghiem-*`, `monhoc-thongtin`,...) | Đổi sang menu-based permission |

---

## 5. Kế hoạch kiểm thử (Verification)

1. **Kiểm tra biên dịch:** Chạy `npm run build` đảm bảo không có lỗi kiểu dữ liệu và injection token.
2. **Kiểm tra đăng nhập & điều hướng:**
   - Tài khoản chỉ có menu Đào tạo (`dao-tao` / `daotao_ld`): Sau login tự động vào `/admin/daotao_ld/dashboard`.
   - Tài khoản có menu Quản trị (`administrator`): Sau login tự động vào `/admin/dashboard`.
   - Tài khoản Lãnh đạo trường (`lanhdao-truong`): Sau login vào đúng dashboard tương ứng.
3. **Kiểm tra Route Guard:**
   - Truy cập trực tiếp vào URL không có trong menu được cấp -> Chuyển hướng về `/admin/404?reason=access-denied`.
   - Truy cập URL có trong menu -> Mở bình thường.
4. **Kiểm tra phân quyền màn hình chi tiết (`monhoc-kiemtra-danhgia`):**
   - Đảm bảo các cờ `routerDaotao`, `routerLanhdaokhoa`, `isManager` nhận diện đúng theo các menu mà user sở hữu.
   - Các nút tạo/xóa đề hiển thị đúng theo quyền hạn.
