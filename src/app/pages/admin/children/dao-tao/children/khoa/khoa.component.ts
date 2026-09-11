import { Component } from '@angular/core';
import { DonviComponent } from '@app/components/danh-muc/donvi/donvi.component';

@Component({
    standalone: true,
    selector: 'app-khoa',
    imports: [DonviComponent],
    template: '<app-donvi></app-donvi>',
})
export default class KhoaComponent { }
