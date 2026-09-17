# Kế hoạch Migrate Component `monhoc-thongtin` lên Angular 20+

## 1. Bối cảnh & Yêu cầu
- `src/app/pages/course-detail/children/monhoc-thongtin/` là code cũ từ Angular 14.
- Ứng dụng hiện tại đang dùng Angular 21 (người dùng gọi là Angular 20), kiến trúc Standalone Component.
- Yêu cầu người dùng: **Giữ nguyên toàn bộ logic nghiệp vụ, chỉ nâng cấp tương thích Angular mới, sử dụng model từ `src/app/models`**.

## 2. Các vấn đề cần giải quyết
1. **Import cũ không tồn tại**:
   - `@modules/shared/*`, `@core/*`, `@shared/services/*` không có trong `tsconfig.json`.
   - Cần chuyển sang: `@models/*`, `@services/*`, `@theme/*`, `@utilities/*`, `@env`.
2. **Model**:
   - Dùng `Course` từ `@models/course`.
   - Dùng `DonVi`, `NganhBomon` từ `@models/danh-muc`.
   - Dùng `IctuConditionParam`, `IctuQueryCondition`, `DtoObject` từ `@models/dto`.
   - Dùng model CTĐT từ `@models/dtkh/ctdt`, `@models/dtkh/ctdt_hocphan`, `@models/dtkh/ctdt-config`, `@models/dtkh/course-plan-activities`. Sửa các import cũ trong các model này nếu còn trỏ `@core`.
3. **Services**:
   - Chuyển `AuthService` sang `AuthenticationService` từ `@services/authentication.service`.
   - Chuyển `NotificationService` sang `@services/notification.service`.
   - Chuyển `ElnKhoaHocService` sang `CourseService` từ `@services/course.service`.
   - Chuyển `DonViService` & `ElnChuyenMucService` sang `DanhMucService` từ `@services/danh-muc.service`.
   - Đối với các service CTĐT (`CtdtService`, `CtdtHocphanService`, `CtdtConfigService`, `CoursePlanActivitiesService`): kiểm tra endpoint API backend và tạo service tương ứng chuẩn Angular 20/21 kế thừa `IctuBaseServiceClass` hoặc dùng `HttpClient` + `@services/*`.
4. **UI Components / PrimeNG**:
   - Thay các component cũ của Ovic (`ovic-dropdown`, `ovic-editor`, `ovic-groups-radio-v2`, `form-document-file-and-link`) bằng các control tương đương hiện có:
     - Dropdown: PrimeNG `Select` hoặc `p-select` (PrimeNG v21).
     - Editor: `ictu-editor` từ `@theme/components/ictu-editor/ictu-editor.component` hoặc `ngx-editor`.
     - File: `ictu-file-uploader` hoặc component quản lý tài liệu hiện có.
     - Radio group: `input[type="radio"]` chuẩn hoặc PrimeNG `RadioButton`.
   - MultiSelect: PrimeNG `p-multiSelect` v21.
5. **Cú pháp Angular hiện đại**:
   - Thay `.toPromise()` bằng `firstValueFrom()`.
   - Thay `styleUrls` bằng `styleUrl`.
   - Xử lý Subscription bằng `takeUntilDestroyed` hoặc `destroy$`.
   - Tích hợp với `course-detail.component.ts` (tab 'info' hiện gọi `app-course-info`).

## 3. Các bước thực hiện
1. **Bước 1**: Rà soát và cập nhật model trong `src/app/models/` (đặc biệt `course.ts` và các file `dtkh/` liên quan) để đảm bảo không còn import rác `@core/*`.
2. **Bước 2**: Tạo/bổ sung các service cần thiết trong `src/app/services/` cho CTĐT và Học phần nếu chưa có.
3. **Bước 3**: Cập nhật `monhoc-thongtin.component.ts`:
   - Chuẩn hóa imports, inject services.
   - Giữ nguyên toàn bộ logic xử lý: tính tín chỉ, hình thức thi, CĐR, tạo bài kiểm tra thường xuyên theo `key_server`, lưu môn học và CTĐT.
4. **Bước 4**: Cập nhật `monhoc-thongtin.component.html`:
   - Thay thế các tag Ovic legacy bằng các component chuẩn của hệ thống mới.
   - Đảm bảo form bindings (`formControlName`, `formGroup`) khớp hoàn toàn.
5. **Bước 5**: Kết nối với `course-detail` (hoặc chuyển nội dung vào `course-info.component` theo đúng flow của tab `info`).
6. **Bước 6**: Build thử nghiệm (`npm run build`) và sửa các lỗi type / template.
