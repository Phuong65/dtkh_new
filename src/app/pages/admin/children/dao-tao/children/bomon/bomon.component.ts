import { Component } from '@angular/core';
import { DmBomonComponent } from '@app/components/danh-muc/bomon/nganh-bomon.component';

@Component({
    standalone  : true,
    selector    : 'app-bomon',
    imports: [DmBomonComponent],
    template:'<app-dm-bomon></app-dm-bomon>', 
})
export default class BomonComponent {}
