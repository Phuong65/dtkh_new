import { Component , inject } from '@angular/core';
import { IctuLibraryComponent } from '@components/ictu-library/ictu-library.component';
import { AuthenticationService } from '@services/authentication.service';

@Component({
    standalone  : true,
    selector    : 'app-tai-lieu',
    imports     : [ IctuLibraryComponent ] ,
    templateUrl : './tai-lieu.component.html',
    styleUrl    : './tai-lieu.component.css'
})
export default class TaiLieuComponent {
    private readonly auth : AuthenticationService = inject( AuthenticationService );

    protected readonly userId : number = this.auth.user?.id || 0;

    protected readonly donviId : number = this.auth.user?.donvi_id || 0;
}
