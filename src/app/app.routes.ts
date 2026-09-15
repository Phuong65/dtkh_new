import { Routes } from '@angular/router';
import { PreviewComponent , previewRoutes } from "@pages/preview";
import { adminGuard } from "@guards/admin.guard";
import { authGuard } from "@guards/auth.guard";

export const routes : Routes = [
	{
		path         : 'admin' ,
		canActivate  : [ adminGuard ] ,
		loadChildren : () : Promise<any> => import('@pages/admin/admin.module').then( m => m.AdminModule )
	} ,
	{
		path         : 'auth' ,
		loadChildren : () : Promise<any> => import('@pages/auth/auth.module').then( m => m.AuthModule )
	} ,
	{
		path          : 'throw-error' ,
		loadComponent : () : Promise<any> => import('@pages/throw-error/throw-error.component').then( c => c.ThrowErrorComponent )
	} ,
	{
		path          : 'unauthorized' ,
		loadComponent : () : Promise<any> => import('@pages/unauthorized/unauthorized.component').then( c => c.UnauthorizedComponent )
	} ,
	{
		path      : 'preview' ,
		component : PreviewComponent ,
		children  : previewRoutes
	} ,
	{
		path: 'course-detail/:id',
		canActivate: [authGuard],
		loadComponent: () => import('@pages/course-detail/course-detail.component').then(c => c.CourseDetailComponent),
		children: [
			{
				path: '',
				redirectTo: 'info',
				pathMatch: 'full'
			},
			{
				path: 'info',
				loadComponent: () => import('@components/coming-soon/coming-soon.component').then(c => c.ComingSoonComponent)
			},
			{
				path: 'outcomes',
				loadComponent: () => import('@components/coming-soon/coming-soon.component').then(c => c.ComingSoonComponent)
			},
			{
				path: 'content',
				loadComponent: () => import('@components/coming-soon/coming-soon.component').then(c => c.ComingSoonComponent)
			},
			{
				path: 'questions',
				loadComponent: () => import('@components/coming-soon/coming-soon.component').then(c => c.ComingSoonComponent)
			},
			{
				path: 'assessment',
				loadComponent: () => import('@components/coming-soon/coming-soon.component').then(c => c.ComingSoonComponent)
			},
			{
				path: 'exam-form',
				loadComponent: () => import('@components/coming-soon/coming-soon.component').then(c => c.ComingSoonComponent)
			},
			{
				path: 'settings',
				loadComponent: () => import('@components/coming-soon/coming-soon.component').then(c => c.ComingSoonComponent)
			}
		]
	},
	{
		path       : '**' ,
		redirectTo : '/auth/login' ,
		pathMatch  : 'full'
	}
];
