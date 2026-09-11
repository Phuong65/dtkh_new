import { Component } from '@angular/core';
import { NganhBomonComponent } from '@app/components/danh-muc/nganh/nganh-bomon.component';

@Component({
    standalone: true,
    selector: 'app-nganh',
    imports: [NganhBomonComponent],
    template: '<app-nganh-bomon></app-nganh-bomon>',
})
export default class NganhComponent { }
