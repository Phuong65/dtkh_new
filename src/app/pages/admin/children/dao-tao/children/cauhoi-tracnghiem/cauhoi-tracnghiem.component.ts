import { Component } from '@angular/core';
import { CauhoiTracnghiemManagerComponent } from '@app/components/dtkh/cauhoi-trachnghiem/cauhoi-tracnghiem-manager/cauhoi-tracnghiem-manager.component';

@Component({
    standalone  : true,
    selector    : 'app-cauhoi-tracnghiem',
    imports: [CauhoiTracnghiemManagerComponent],
    template: '<app-cauhoi-tracnghiem-manager></app-cauhoi-tracnghiem-manager>',
})
export default class CauhoiTracnghiemComponent {}
 