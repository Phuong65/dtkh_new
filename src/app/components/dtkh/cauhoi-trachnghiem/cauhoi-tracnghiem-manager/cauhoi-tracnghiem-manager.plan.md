# Plan: CauhoiTracnghiemManagerComponent Angular 21

## Mục tiêu

Viết lại `CauhoiTracnghiemManagerComponent` theo cấu trúc Angular 21, giữ nguyên nghiệp vụ quản lý câu hỏi trắc nghiệm và chỉ gọi các component con hiện có, không sửa nội dung bên trong chúng.

## Phạm vi

### Component chính

- Dùng standalone component.
- Dùng `inject()`, signals, `computed()`, `viewChild()`.
- Dùng Angular built-in control flow: `@if`, `@for`.
- Quản lý danh sách môn học, phân trang, tìm kiếm.
- Chọn môn học và tải cây kế hoạch/Câu hỏi/CDR.
- Tính thống kê Public, Private, Đã duyệt, Chưa duyệt, Tổng số.
- Mở màn hình thêm câu hỏi chi tiết bằng route hiện có.
- Thiết lập số lượng câu hỏi KTHP.
- Xóa câu hỏi chưa duyệt theo bài/CDR theo batch.

### Component con

Chỉ gọi, không sửa nội dung:

- `XoaCauHoiTheoBaiCdrComponent`
- `CauhoiTracnghiemChitietComponent` thông qua route

### Services được phép sửa

Chỉ các file trong `src/app/services/dtkh/`:

- `elearning-khoa-hoc.service.ts`
- `course-plan-activities.service.ts`
- `course-questions.service.ts`

Các service được chuyển sang:

- `getApiRouteLink()` thay cho `getRoute()` cũ.
- `paramsConditionBuilder()` thay cho `HttpParamsHeplerService` cũ.
- Alias model Angular 21 trong `@models/*`.
- `inject(HttpClient)`.
- Giữ nguyên endpoint và public method cần thiết.

### Model tương thích tối thiểu

Chỉ sửa import/type cần thiết để Angular 21 build được:

- `condition-option.ts`
- `course-plan-activities.ts`
- `course-questions.ts`
- `elng-khoa-hoc.ts`
- `elng-user-profile.ts`
- Các import file model liên quan trực tiếp.

## Luồng dữ liệu

1. Component khởi tạo.
2. Gọi `ElnKhoaHocService.getKhoaHocByPageNew_2()`.
3. Người dùng chọn môn học.
4. Gọi song song:
   - `CoursePlanActivitiesService.getCoursePlanActivitiesByPageNew()`.
   - `CourseQuestionsService.getCourseQuestionsByPageNew()`.
5. Ghép parent plan, CDR và thống kê câu hỏi trong component.
6. Hiển thị bảng theo lesson/CDR/mức độ.
7. Các thao tác thêm, sửa phân bổ, xóa gọi service hiện có.

## Quyền

Dùng `AuthenticationService.getUserPermission('cauhoi-tracnghiem')` và `IctuPermissionControl`:

- `canCreate`: thêm/phân bổ câu hỏi.
- `canDelete`: xóa câu hỏi.
- `canUpdate`: giữ cho các thay đổi cập nhật nếu cần mở rộng sau.

## Kiểm tra bắt buộc

- `npm run build` phải hoàn tất không có lỗi TypeScript/Angular template.
- Không còn import alias cũ `@core/...`, `@modules/...` trong các file trực tiếp thuộc luồng manager.
- Không sửa component con.
- Không thêm `console.log`.
- Không hardcode secret/token.
- Kiểm tra git diff để xác nhận thay đổi đúng phạm vi.

## Rủi ro còn lại

- Dependency `@ng-bootstrap/ng-bootstrap` phải tương thích Angular 21.
- API backend vẫn dùng response cũ `{ data, recordsFiltered }`.
- Cấu hình giới hạn câu hỏi chưa có service riêng; hiện giữ mặc định an toàn và có thể nối `SysConfigsService` ở bước sau.

## Fixes Applied (2026-09-18)

- **Thêm bộ lọc Đơn vị chuyên môn / Khoa** (lines 41-57 trong `cauhoi-tracnghiem-manager.component.html` và TS):
  - Thay `<ovic-dropdown>` (không tồn tại trong Angular 21) bằng `<p-select>` từ PrimeNG `SelectModule`.
  - Khai báo các getter kiểm tra vai trò: `routerAdmin` (`administrator`), `routerDaotao` (`daotao_ld`), `routerKhaothi`.
  - Thêm `list_donvi_chuyenmon: DonVi[]`, `categoryFilter: number | null`.
  - Gọi `DanhMucService.getDonViList()` khi khởi tạo component để tải danh sách khoa.
  - Xử lý sự kiện `onChangeFilterChuyenmon($event)` để cập nhật `categoryFilter` và tự động lọc danh sách môn học qua điều kiện query `category_ids`.
  - Dùng cú pháp control flow `@if` của Angular 21 thay cho `*ngIf`.
  - `npm run build` pass hoàn toàn, không có lỗi AOT/TypeScript.
