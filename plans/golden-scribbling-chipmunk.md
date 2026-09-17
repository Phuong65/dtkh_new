# Plan: Nâng cấp `monhoc-muctieu-cdr` lên Angular 21

## Context
Dự án Angular 21 (standalone, signals, inject API). Component `monhoc-muctieu-cdr` viết theo Angular 14 với import path alias cũ (`@modules/shared/*`, `@core/*`) và service không còn tồn tại. Tab "Mục tiêu - CĐR" của `course-detail` hiện dùng `CourseOutcomesComponent` (template trống — chỉ có 1 comment). Nhiệm vụ: tái viết `monhoc-muctieu-cdr.component.ts/.html` để build được trên Angular 21.

## Phân tích lỗi cần fix

### 1. Import path
- Models: đổi sang `@models/dtkh/...`.
- DTO: dùng `@models/dto`, `IctuQueryCondition`, `IctuConditionParam`, `IctuQueryParams`.
- Shared: dùng `@shared/shared.module`.
- Notification: dùng `@services/notification.service`.
- Authentication: dùng `@services/authentication.service`.
- Helper: dùng `Helper.arraySort()` từ `@utilities/helper`.

### 2. Service lấy từ `dtkh_v2.x`
Nguồn: `E:\New folder (3)\dtkh_v2.x\src\app\modules\shared\services`.
Tạo lại tại `src/app/services/`, giữ endpoint và hành vi API của bản v2.x, đổi import sang cấu trúc mới:
- `course-muctieu-chitiet.service.ts` — endpoint `course-muctieu-chitiet/`
- `course-clo.service.ts` — endpoint `course-clo/`
- `course-clo-contribute.service.ts` — endpoint `course-clo-contribute/`
- `ctdt-cdr.service.ts` — endpoint `ctdt-cdr/`
- `ctdt-hocphan.service.ts` — endpoint `ctdt-hocphan/`
- `ctdt.service.ts` — endpoint `ctdt/`

Các service giữ phương thức cũ (`add*`, `update*`, `delete*`, `get*ByPageNew`, `delete*ByCol`) để giảm thay đổi component; chỉ thay các import legacy (`@core`, `src/environments/environment`) bằng alias hiện có (`@models`, `@env`, `@services`).

### 3. Component Angular hiện đại
Refactor `src/app/pages/course-detail/children/monhoc-muctieu-cdr/monhoc-muctieu-cdr.component.ts`:
- Nhận `course` và `courseId` bằng `input<Course | null>()` / `input<number>()`, tương thích `course-detail`.
- Dùng model ở `src/app/models`, đặc biệt `Course` và các model `dtkh`.
- Dùng `AuthenticationService`, `NotificationService`, `Helper` mới.
- Dùng `IctuQueryCondition` / `ConditionOption` phù hợp với service đã port.
- Chuyển `confirmDelete().then(...)` sang `confirmDelete(1).subscribe(...)`.
- Loại bỏ `openSideNavigationMenu` (không có trong service mới); dùng state hiển thị dialog/template hiện có.
- Dọn import không dùng, xử lý nullable `course`/ID, giữ nguyên các thao tác CRUD và mapping CLO–PI.

### 4. Template
Refactor `monhoc-muctieu-cdr.component.html`:
- Đưa nội dung vào `course-outcomes.component.html` hoặc đổi `CourseOutcomesComponent` thành wrapper dùng component đã refactor; cập nhật `course-detail` nếu cần.
- Đổi selector editor cũ `ovic-editor` sang component hiện có `ictu-editor`, cập nhật binding theo API (`content`, `contentChange`); giữ nút lưu riêng.
- Thay pipe không tồn tại `safeHtmlDecode` bằng helper/hiển thị HTML đã kiểm soát; thay `showlabel` bằng hàm tìm label trong component.
- Giữ PrimeNG `p-table`/`p-dialog`, Material progress bar; dùng Angular control flow hiện có khi cần.

## Files cần tạo/sửa
- Tạo 6 service dưới `src/app/services/` như trên.
- Sửa `src/app/pages/course-detail/children/monhoc-muctieu-cdr/monhoc-muctieu-cdr.component.ts`.
- Sửa `src/app/pages/course-detail/children/monhoc-muctieu-cdr/monhoc-muctieu-cdr.component.html`.
- Sửa `src/app/pages/course-detail/children/outcomes/course-outcomes.component.ts/.html` để tab mới hiển thị component.
- Giữ CSS hiện có, chỉ chỉnh nếu template/component mới cần.

## Thứ tự thực hiện
1. Đọc và port 6 service từ `dtkh_v2.x`, kiểm tra endpoint/import.
2. Refactor component, giữ nguyên nghiệp vụ load/save/delete/reorder và chọn PI.
3. Tích hợp component vào tab `outcomes` bằng `course`/`courseId` inputs.
4. Sửa template bindings, pipes, dialog/editor.
5. Chạy build, sửa lỗi TypeScript/template còn lại.

## Verification
- Chạy `npm run build` hoặc `ng build` và đạt 0 lỗi.
- Mở `/course-detail/:id`, chuyển tab `Mục tiêu - CĐR`.
- Kiểm tra tải mục tiêu/CLO/CTDT, sửa nội dung, thêm/xóa/reorder, gán CLO–CO, chọn PI và lưu mapping.
- Xác nhận lỗi API hiển thị toast và trạng thái loading luôn được tắt.
