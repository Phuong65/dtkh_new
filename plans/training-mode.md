# Plan: Cập nhật Training Mode Component

## Context
`TrainingModeComponent` (`src/app/components/danh-muc/training-mode/`) hiện là standalone rỗng. Cần cập nhật thành màn hình quản trị **hình thức đào tạo**:
- Hiển thị danh sách bằng `IctuDataTable2`
- Form CUD (Thêm / Sửa / Xóa) bằng Drawer và `IctuFormControl2`
- Model: `TrainingMode` (`src/app/models/training-mode.ts`)
- API endpoint: `training-modes` phân trang `limit: 20`
- Service: viết riêng `TrainingModeService` tại `src/app/services/training-mode.service.ts` theo dạng của project (`extends IctuBaseServiceClass<TrainingMode>`), không gộp vào `DanhMucService`.

---

## 1. Tạo Service riêng: `TrainingModeService`
- **File**: `src/app/services/training-mode.service.ts`
- **Pattern**: kế thừa `IctuBaseServiceClass<TrainingMode>` giống `DepartmentsService` (`src/app/services/departments.service.ts`).
```typescript
import { Injectable } from '@angular/core';
import { IctuBaseServiceClass } from '@models/ictu-base-service.class';
import { TrainingMode } from '@models/training-mode';

@Injectable({
    providedIn: 'root'
})
export class TrainingModeService extends IctuBaseServiceClass<TrainingMode> {
    constructor() {
        super('training-modes');
    }
}
```
- Các method sẵn có từ `IctuBaseServiceClass`:
  - `query(conditions: IctuConditionParam[], queryParams?: IctuQueryParams)`: gọi GET `api/training-modes` với param phân trang `paged`, `limit: 20`, sort, condition search `name`.
  - `create(info: Partial<TrainingMode>)`: gọi POST `api/training-modes`.
  - `update(id: number, info: Partial<TrainingMode>)`: gọi PUT `api/training-modes/{id}`.
  - `delete(id: number)`: gọi DELETE `api/training-modes/{id}`.

---

## 2. Triển khai Logic Component: `TrainingModeComponent`
- **File**: `src/app/components/danh-muc/training-mode/training-mode.component.ts`
- **Imports**:
  - Angular core & common: `Component, inject, OnDestroy, OnInit, signal, Signal, viewChild, WritableSignal, CommonModule`
  - Forms: `FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators`
  - PrimeNG: `Drawer` (`primeng/drawer`), `InputText` (`primeng/inputtext`), `Textarea` (`primeng/textarea`)
  - Material: `MatButton` (`@angular/material/button`), `MatCheckbox` (`@angular/material/checkbox`)
  - Shared/Theme: `IctuPaginatorComponent`, `LoadingProgressComponent`
  - Models: `TrainingMode`, `DataTableEvent, DataTableEventName, IctuDataTable2, IctuDataTablePaginatorInfo`, `IctuFormControl2`, `AppState`, `DtoObject`, `IctuConditionParam, IctuQueryCondition, IctuQueryParams`
  - Services: `TrainingModeService`, `NotificationService`
  - RxJS: `forkJoin, Observable, Subject, takeUntil`
- **Cấu trúc Component**:
  - `dataTable = new IctuDataTable2<TrainingMode>({ rows: 20, pageLinkSize: 5 })` (đảm bảo limit 20).
  - `formControl = new IctuFormControl2<TrainingMode>({ ... })` với `formGroup`:
    - `name`: `['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]]`
    - `code`: `['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]`
    - `description`: `['']`
    - `objectName`: `'hình thức đào tạo'`
  - State & Search: `state = signal<AppState>('loading')`, `_search = ''`, `_temp = { paged: 1, resetPaginator: true }`.
  - Event handler: `OPEN_FORM_ADD`, `OPEN_FORM_UPDATE`, `DELETE_SINGLE_ROW`, `DELETE_SELECTED_ROWS`, `SUBMIT_FORM`.
  - Các hàm CUD:
    - `loadData(paged = 1, resetPaginator = true)`: gọi `trainingModeService.query(conditions, queryParams)` với `limit: 20`, map dữ liệu vào `dataTable.fillRawData(response, { paged, resetPaginator })`.
    - `addNewItem()`: reset form, mở drawer add.
    - `editRow(row)`: reset form theo `row`, mở drawer edit.
    - `submitForm()`: validate form, gọi `trainingModeService.create()` hoặc `update()`, thông báo toast success, đóng drawer, reload data.
    - `deleteRow(row)`: `notification.confirmDelete(1)`, gọi `trainingModeService.delete(row.id)`, toast success, reload trang hiện tại.
    - `deleteSelectedRows()`: `notification.confirmDelete(n)`, `forkJoin(selected.map(...))`, reload trang 1.

---

## 3. Xây dựng Template: `training-mode.component.html`
- **File**: `src/app/components/danh-muc/training-mode/training-mode.component.html`
- **Layout chuẩn theo `donvi.component.html`**:
  - Header: Tiêu đề `Danh sách hình thức đào tạo`, input search Enter, button xóa các dòng đã chọn, button thêm mới (+).
  - Table:
    - Cột checkbox chọn tất cả / từng hàng (`dataTable.selectRow`)
    - Cột STT (`dataTable.paginator.startIndex() + i`)
    - Cột `Mã hình thức đào tạo` (`row.code`)
    - Cột `Tên hình thức đào tạo` (`row.name`)
    - Cột `Mô tả` (`row.description || '—'`)
    - Cột `Hành động`: nút sửa (`editRow(row)`), nút xóa (`deleteRow(row)`)
    - Empty state khi không có bản ghi
  - Paginator: `ictu-paginator` gắn `[control]="dataTable.paginator"` và `(onChangePage)="onChangePage($event)"`.
  - Drawer form:
    - Header: tự động theo `formControl.heading()` ("Thêm mới hình thức đào tạo" / "Cập nhật hình thức đào tạo")
    - Body: form reactive với trường Tên (`name`), Mã (`code`), Mô tả (`description`)
    - Footer: Button `Lưu lại` (disabled khi form invalid/submitting) và Button `Hủy`.
  - Loading: `app-loading-progress` khi `state() === 'loading'` hoặc `formControl.enableLoading()`.

---

## 4. Verification
1. `npm run build` để kiểm tra compile TypeScript và template AOT.
2. Kiểm tra API query: params gửi lên `paged`, `limit: 20`, `orderby: 'name'`, `order: 'ASC'`, search condition khi có `_search`.
3. Kiểm tra các luồng:
   - Thêm mới: mở drawer -> nhập hợp lệ -> lưu -> gọi API POST -> đóng drawer -> reload dữ liệu.
   - Cập nhật: bấm sửa -> nạp đúng dữ liệu cũ -> lưu -> gọi API PUT -> cập nhật bảng.
   - Xóa đơn & xóa nhiều: popup xác nhận -> gọi API DELETE -> toast thông báo -> reload danh sách.

---

## Danh sách File tác động
1. `src/app/services/training-mode.service.ts` (Tạo mới)
2. `src/app/components/danh-muc/training-mode/training-mode.component.ts` (Cập nhật)
3. `src/app/components/danh-muc/training-mode/training-mode.component.html` (Cập nhật)
4. `plans/training-mode.md` (Ghi file plan vào folder plans của project)
