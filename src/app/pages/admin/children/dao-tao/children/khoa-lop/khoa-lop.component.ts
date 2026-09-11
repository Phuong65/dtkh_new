import { Component } from '@angular/core';
import { KhoaLopComponent as KhoaLopContentComponent } from '@components/khoa-lop/khoa-lop.component';

@Component( {
    standalone  : true ,
    selector    : 'app-khoa-lop-page' ,
    imports     : [ KhoaLopContentComponent ] ,
    template    : '<app-khoa-lop></app-khoa-lop>'
} )
export default class KhoaLopComponent {}