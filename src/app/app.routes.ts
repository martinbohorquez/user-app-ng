import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserComponent } from './components/user/user.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/users'
	},
	{
		path: 'users',
		component: UserComponent
	},
	{
		path: 'users/page/:page',
		component: UserComponent
	},
	{
		path: 'users/create',
		component: UserFormComponent,
		canActivate: [authGuard]
	},
	{
		path: 'users/edit/:id',
		component: UserFormComponent,
		canActivate: [authGuard]
	},
	{
		path: 'login',
		component: AuthComponent
	}
];
