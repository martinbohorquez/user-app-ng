import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { login, loginError, loginSuccess } from './auth.actions';

@Injectable()
export class AuthEffects {
	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(login),
			exhaustMap((action) =>
				this.service.loginUser({ username: action.username, password: action.password }).pipe(
					map((response) => {
						const token = response.token;
						const payload = this.service.getPayload(token);

						const loginData = {
							user: { username: payload.sub },
							isAuth: true,
							isAdmin: payload.isAdmin
						};

						this.service.token = token;
						this.service.user = loginData;
						return loginSuccess({ login: loginData });
					}),
					catchError((error) => of(loginError({ error: error.error.message })))
				)
			)
		)
	);
	loginSuccess$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(loginSuccess),
				tap(() => {
					this.router.navigate(['/users']);
				})
			),
		{ dispatch: false }
	);
	loginError$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(loginError),
				tap((action) => {
					Swal.fire('Error en el login', action.error, 'error');
				})
			),
		{ dispatch: false }
	);
	constructor(private service: AuthService, private actions$: Actions, private router: Router) {}
}
