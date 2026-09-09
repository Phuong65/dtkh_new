import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    selector: 'app-administrator',
    templateUrl: './administrator.component.html',
    styleUrl: './administrator.component.css'
})
export class AdministratorComponent {
}
