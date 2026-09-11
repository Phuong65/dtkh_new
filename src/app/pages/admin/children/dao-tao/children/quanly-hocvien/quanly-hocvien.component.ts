import { Component } from '@angular/core';
import { HocVienComponent } from '@components/hoc-vien/hoc-vien.component';

@Component( {
    standalone  : true ,
    selector    : 'app-quanly-hocvien' ,
    imports     : [ HocVienComponent ] ,
    templateUrl : './quanly-hocvien.component.html' ,
    styleUrl    : './quanly-hocvien.component.css'
} )
export default class QuanlyHocvienComponent {}