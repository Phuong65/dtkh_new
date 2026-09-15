import { ActivatedRouteSnapshot , CanActivateFn , Router , RouterStateSnapshot , UrlTree } from '@angular/router';
import { AuthenticationService } from "@services/authentication.service";
import { inject } from "@angular/core";
import { IctuNavigation } from "@theme/types/navigation";

export const adminModuleGuard : CanActivateFn = ( _ : ActivatedRouteSnapshot , state : RouterStateSnapshot ) : boolean | UrlTree => {
	const auth : AuthenticationService = inject( AuthenticationService );
	const router : Router              = inject( Router );
	return auth.userCanAccessRoute( state.url ) || router.createUrlTree( [ 'admin/404' ] , {
		queryParams : {
			reason : 'access-denied' ,
			time   : Date.now()
		}
	} );
};
