# Plan: Bổ sung quyền Lãnh đạo trường độc lập

## Context

`administrator` và Lãnh đạo trường là hai quyền độc lập.

- `dtkh_v2.x` định danh Lãnh đạo trường bằng role `truong_ld` (`ROLES.manager`) và route/menu `lanhdao-truong`.
- Route legacy `/admin/lanhdao-truong` có các trang `dashboard`, `thong-tin-tai-khoan`, `trogiup-kythuat`.
- Nhiều tính năng legacy kiểm tra riêng `ROLES.manager`; đây không phải alias của `administrator`.
- `dtkh_new` hiện mới khai báo role `administrator`; menu và CRUD permission được nhận từ API `/permission` dưới dạng `roles`, `menus`, `pms: [view, create, update, delete]`.

Mục tiêu: thêm `truong_ld` như một role độc lập, tạo feature routing riêng theo kiến trúc Angular 21 hiện tại, giữ nguyên toàn bộ hành vi của `administrator`.

## 1. Lập bảng quyền nguồn chính xác

Trước khi port UI, lấy response `/permission` của một tài khoản `truong_ld` từ môi trường v2 hoặc backend tương ứng, rồi lập bảng:

- menu cha và `id`/`url`;
- menu con và route đầy đủ;
- `pms` của từng route;
- các màn hình có logic riêng cho `ROLES.manager`.

Lý do: `menu-test.ts` của v2 chỉ khai báo menu `lanhdao-truong` với `child: []`; khoảng 115 file dùng `ROLES.manager`, nhưng các lần kiểm tra role không đủ để suy ra chính xác toàn bộ quyền được backend cấp. Payload `/permission` là nguồn sự thật.

## 2. Mở rộng model role, không gộp với administrator

### `src/app/models/role.ts`

- Đổi `Role.name` từ literal `'administrator'` sang `SysRoleName`.
- Khai báo độc lập:
  - `SysRoleName = 'administrator' | 'truong_ld'`.
- Giữ mapping hiện tại:
  - `administrator -> /admin/dashboard`.
- Thêm mapping riêng:
  - `truong_ld -> /admin/lanhdao-truong/dashboard`.

Luồng đăng nhập hiện tại trong `login.component.ts` và `redirect-uri-call-back.ts` tiếp tục dùng `maxPowerRoleUser()` và `APP_REDIRECT_LINKS`; không cần thêm nhánh hard-code.

### `src/app/providers/admin-role.provider.ts`

- Giữ `ROLE_PROVIDER.administrator`.
- Thêm `ROLE_PROVIDER.truong_ld` với `useValue: 'truong_ld'`.
- Đổi mô tả `InjectionToken` sang tên trung lập, ví dụ `Current admin-area role`.
- Không ánh xạ `truong_ld` thành `administrator`.

## 3. Tạo feature module Lãnh đạo trường riêng

Tạo cấu trúc theo pattern hiện tại:

- `src/app/pages/admin/children/lanhdao-truong/lanhdao-truong.module.ts`
- `src/app/pages/admin/children/lanhdao-truong/lanhdao-truong-routing.module.ts`
- layout standalone `lanhdao-truong.component.{ts,html,css}` nếu cần navigation/header riêng;
- `children/` chứa các màn hình chỉ thuộc Lãnh đạo trường.

`LanhDaoTruongModule` đăng ký `ROLE_PROVIDER.truong_ld`. `AdminModule` vẫn giữ `ROLE_PROVIDER.administrator`; injector feature sẽ cung cấp role gần nhất cho cây Lãnh đạo trường.

Routing feature:

- `'' -> dashboard`;
- `dashboard`;
- `thong-tin-tai-khoan`;
- `trogiup-kythuat`;
- `canActivateChild: [adminModuleChildGuard]`.

Tái sử dụng thay vì sao chép:

- `dashboard`: dùng dashboard hiện tại nếu hành vi tương đương;
- `thong-tin-tai-khoan`: dùng component account/profile hoặc account/info hiện tại sau khi đối chiếu chức năng;
- `trogiup-kythuat`: chưa có tương đương trong `dtkh_new`; chuyển nội dung cần thiết từ `LockedContentComponent` sang standalone component dùng design system hiện tại.

## 4. Đăng ký route cha độc lập

### `src/app/pages/admin/admin-routing.module.ts`

Thêm route ngang hàng với `administrator`:

```typescript
{
    path         : 'lanhdao-truong' ,
    canActivate  : [ adminModuleGuard ] ,
    loadChildren : () => import('@pages/admin/children/lanhdao-truong/lanhdao-truong.module')
        .then((m) => m.LanhDaoTruongModule)
}
```

Không redirect `lanhdao-truong` sang `administrator`. Không sửa route/module `administrator`.

## 5. Đồng bộ menu và CRUD permission

Ưu tiên payload API; không thêm menu tĩnh vào `utilities/syscats.ts`.

Backend `/permission` cho Lãnh đạo trường phải trả:

- role `{ name: 'truong_ld', ... }`;
- menu cha `id: 'lanhdao-truong'`, `url: 'lanhdao-truong'`;
- child IDs khớp route đầy đủ, ví dụ:
  - `lanhdao-truong/dashboard`;
  - `lanhdao-truong/thong-tin-tai-khoan`;
  - `lanhdao-truong/trogiup-kythuat`;
- `pms` đúng theo bảng quyền nguồn ở bước 1.

Cách đặt ID này tương thích trực tiếp với:

- `adminModuleGuard`: kiểm tra prefix `/admin/${nav.id}/`;
- `adminModuleChildGuard`: kiểm tra URL đầy đủ `/admin/${child.id}`;
- `AuthenticationService.getUserPermission(route)`: chuyển `pms` thành `view/create/update/delete`.

Các component port từ v2 dùng `auth.userHasRole(['truong_ld'])` hoặc helper `isSchoolLeader`; không dùng điều kiện `administrator || truong_ld` trừ khi bảng quyền nghiệp vụ xác nhận cả hai được phép.

## 6. Không copy phần legacy không thuộc phạm vi

- Không copy toàn bộ `ROLES`, `ROUTERS`, `HOIDONGDUYET`, `CHUAN_DAU_RA` vào `utilities/syscats.ts`.
- Không copy hàng loạt 115 component chỉ vì có `ROLES.manager`.
- Chỉ port feature nằm trong bảng quyền `truong_ld`; chuyển từng component từ Angular 14 NgModule sang Angular 21 standalone, dùng service/model/design system hiện tại.

## Critical files

Sửa:

- `src/app/models/role.ts`
- `src/app/providers/admin-role.provider.ts`
- `src/app/pages/admin/admin-routing.module.ts`

Tạo:

- `src/app/pages/admin/children/lanhdao-truong/lanhdao-truong.module.ts`
- `src/app/pages/admin/children/lanhdao-truong/lanhdao-truong-routing.module.ts`
- các layout/child component cần thiết theo bảng quyền.

Tham chiếu, chỉ sửa nếu kiểm thử cho thấy cần thiết:

- `src/app/services/authentication.service.ts`
- `src/app/guards/admin-module.guard.ts`
- `src/app/guards/admin-module-child.guard.ts`
- `src/app/pages/auth/login/login.component.ts`
- `src/app/pages/auth/redirect-uri-call-back/redirect-uri-call-back.ts`

## Verification

1. Unit test model/redirect:
   - `administrator` vẫn redirect `/admin/dashboard`;
   - `truong_ld` redirect `/admin/lanhdao-truong/dashboard`.
2. Unit test guards với payload tổng hợp:
   - user chỉ có `truong_ld` truy cập được route/menu được cấp;
   - không tự động truy cập `/admin/administrator`;
   - user chỉ có `administrator` không tự động được xem route Lãnh đạo trường;
   - child thiếu quyền bị chuyển `/admin/404?reason=access-denied`.
3. Unit test `getUserPermission()` cho đủ bốn cờ `view/create/update/delete` theo `pms`.
4. Chạy `npm run build`.
5. E2E thủ công bằng tài khoản `truong_ld`:
   - đăng nhập và redirect đúng;
   - menu Lãnh đạo trường hiển thị đúng;
   - từng child route mở đúng;
   - nút tạo/sửa/xóa tuân theo `pms`;
   - route `administrator` vẫn bị chặn nếu backend không cấp menu đó.
