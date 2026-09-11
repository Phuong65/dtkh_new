import { Component } from '@angular/core';
import { KhoaLopComponent as KhoaLopContentComponent } from '@components/khoa-lop/khoa-lop.component';

@Component( {
    standalone  : true ,
    selector    : 'app-khoa-lop-page' ,
    imports     : [ KhoaLopContentComponent ] ,
    templateUrl : './khoa-lop.component.html' ,
    styleUrl    : './khoa-lop.component.css'
} )
export default class KhoaLopComponent {}