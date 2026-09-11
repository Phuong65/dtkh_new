import { Component } from '@angular/core';
import { HocVienComponent } from '@components/hoc-vien/hoc-vien.component';

@Component( {
    standalone  : true ,
    selector    : 'app-quanly-hocvien' ,
    imports     : [ HocVienComponent ] ,
    template: '<app-hoc-vien></app-hoc-vien>' ,
} )
export default class QuanlyHocvienComponent {}