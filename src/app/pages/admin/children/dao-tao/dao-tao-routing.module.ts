import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminModuleChildGuard } from '@guards/admin-module-child.guard';

const routes: Routes = [
    {
        path: '',
        canActivateChild: [adminModuleChildGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./children/dashboard/dashboard.component')
            },
            {
                path: 'chuongtrinh-daotao',
                loadComponent: () => import('./children/chuongtrinh-daotao/chuongtrinh-daotao.component')
            },
            {
                path: 'quanly-monhoc',
                loadComponent: () => import('./children/quanly-monhoc/quanly-monhoc.component')
            },
            {
                path: 'kehoach-hoctap',
                loadComponent: () => import('./children/kehoach-hoctap/kehoach-hoctap.component')
            },
            {
                path: 'kehoach-hoctap/chitiet-kehoach',
                loadComponent: () => import('./children/kehoach-hoctap/chitiet-kehoach.component')
            },
            {
                path: 'kehoach-hoctap/phanbo-cdr-cauhoi',
                loadComponent: () => import('./children/kehoach-hoctap/phanbo-cdr-cauhoi.component')
            },
            {
                path: 'kehoach-hoctap/form-de',
                loadComponent: () => import('./children/kehoach-hoctap/form-de.component')
            },
            {
                path: 'cauhoi-tracnghiem',
                loadComponent: () => import('./children/cauhoi-tracnghiem/cauhoi-tracnghiem.component')
            },
            {
                path: 'cauhoi-thuchanh-kthp',
                loadComponent: () => import('./children/cauhoi-thuchanh-kthp/cauhoi-thuchanh-kthp.component')
            },
            {
                path: 'cauhoi-thuchanh',
                loadComponent: () => import('./children/cauhoi-thuchanh/cauhoi-thuchanh.component')
            },
            {
                path: 'quanly-noidung-decuong',
                loadComponent: () => import('./children/quanly-noidung-decuong/quanly-noidung-decuong.component')
            },
            {
                path: 'tai-lieu',
                loadComponent: () => import('./children/tai-lieu/tai-lieu.component')
            },
            {
                path: 'lop-hoc-phan',
                loadComponent: () => import('./children/lop-hoc-phan/lop-hoc-phan.component')
            },
            {
                path: 'lop-hoc-phan/class-details',
                loadComponent: () => import('./children/lop-hoc-phan/class-details.component')
            },
            {
                path: 'lop-hoc-phan/class-details/room-test',
                loadComponent: () => import('./children/lop-hoc-phan/room-test.component')
            },
            {
                path: 'lop-hoc-phan/class-details/kt-daugio',
                loadComponent: () => import('./children/lop-hoc-phan/kt-daugio.component')
            },
            {
                path: 'lop-hoc-phan/class-details/chambai-15p',
                loadComponent: () => import('./children/lop-hoc-phan/chambai-15p.component')
            },
            {
                path: 'lop-hoc-phan/class-details/kt-tuluan-15p',
                loadComponent: () => import('./children/lop-hoc-phan/kt-tuluan-15p.component')
            },
            {
                path: 'dongbo-dulieu',
                loadComponent: () => import('./children/dongbo-dulieu/dongbo-dulieu.component')
            },
            {
                path: 'dongbo-dulieu-sinhvien',
                loadComponent: () => import('./children/dongbo-dulieu-sinhvien/dongbo-dulieu-sinhvien.component')
            },
            {
                path: 'thongbao-giangvien',
                loadComponent: () => import('./children/thongbao-giangvien/thongbao-giangvien.component')
            },
            {
                path: 'thongbao-sinhvien',
                loadComponent: () => import('./children/thongbao-sinhvien/thongbao-sinhvien.component')
            },
            {
                path: 'khoa',
                loadComponent: () => import('./children/khoa/khoa.component') 
            },
            {
                path: 'nganh',
                loadComponent: () => import('./children/nganh/nganh.component')
            },
            {
                path: 'bomon',
                loadComponent: () => import('./children/bomon/bomon.component')
            },
            {
                path: 'khoa-lop',
                loadComponent: () => import('./children/khoa-lop/khoa-lop.component')
            },
            {
                path: 'quanly-hocvien',
                loadComponent: () => import('./children/quanly-hocvien/quanly-hocvien.component')
            },
            {
                path: 'he-dao-tao',
                loadComponent: () => import('./children/dao-tao-trainning-mode/dao-tao-trainning-mode.component').then(m => m.DaoTaoTrainningModeComponent)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
}) 
export class DaoTaoRoutingModule {}
