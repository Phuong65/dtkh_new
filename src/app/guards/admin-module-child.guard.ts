import { ActivatedRouteSnapshot , CanActivateChildFn , Router , RouterStateSnapshot , UrlTree } from '@angular/router';
import { AuthenticationService } from "@services/authentication.service";
import { inject } from "@angular/core";
import { IctuNavigation , IctuNavigationItem } from "@theme/types/navigation";

export const adminModuleChildGuard : CanActivateChildFn = ( _ : ActivatedRouteSnapshot , state : RouterStateSnapshot ) : true | UrlTree => {
	const auth : AuthenticationService = inject( AuthenticationService );
	const router : Router              = inject( Router );
	return auth.userCanAccessRoute( state.url ) || router.createUrlTree( [ 'admin/404' ] , {
		queryParams : {
			reason : 'access-denied' ,
			time   : Date.now()
		}
	} );
};
