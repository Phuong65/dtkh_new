import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { adminModuleChildGuard } from '@guards/admin-module-child.guard';
import { AdministratorComponent } from './administrator.component';

const routes : Routes = [
	{
		path             : '' ,
		canActivateChild : [ adminModuleChildGuard ] ,
		component        : AdministratorComponent ,
		children         : [
			{
				path       : '' ,
				redirectTo : 'teacher-accounts' ,
				pathMatch  : 'full'
			} ,
			{
				path          : 'teacher-accounts' ,
				loadComponent : () : Promise<any> => import('./children/teacher-accounts/teacher-accounts.component')
			}
		]
	}
];

@NgModule( {
	imports : [RouterModule.forChild( routes )] ,
	exports : [RouterModule]
} )
export class AdministratorRoutingModule {}