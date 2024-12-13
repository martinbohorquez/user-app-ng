import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, exhaustMap, map, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from '../models/users';
import { UserService } from '../services/user.service';
import {
	add,
	addSuccess,
	findAllPageable,
	load,
	remove,
	removeSuccess,
	setErrors,
	update,
	updateSuccess
} from './users.action';

@Injectable()
export class UserEffects {
	loadUsers$ = createEffect(() =>
		this.actions$.pipe(
			ofType(load),
			exhaustMap((action) =>
				this.service.findAllPageable(action.page).pipe(
					map((pageable) => {
						if (action.page > pageable.totalPages - 1) this.router.navigate(['/users/page', pageable.totalPages - 1]);
						const users = pageable.content as User[];
						const paginator = pageable;
						return findAllPageable({ users, paginator });
					}),
					catchError(() => EMPTY)
				)
			)
		)
	);
	addUsers$ = createEffect(() =>
		this.actions$.pipe(
			ofType(add),
			exhaustMap((action) =>
				this.service.create(action.userNew).pipe(
					map((response) => addSuccess({ userNew: response.user })),
					catchError((error) => (error.status == 400 ? of(setErrors({ errors: error.error.errors })) : EMPTY))
				)
			)
		)
	);
	addSuccessUsers$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(addSuccess),
				tap((action) => {
					this.router.navigate(['/users']);

					Swal.fire({
						title: 'Creado nuevo usuario!',
						text: 'Usuario ' + action.userNew.username + ' creado con éxito!',
						icon: 'success'
					});
				})
			),
		{ dispatch: false }
	);
	updateUsers$ = createEffect(() =>
		this.actions$.pipe(
			ofType(update),
			exhaustMap((action) =>
				this.service.update(action.userUpdated).pipe(
					map((response) => updateSuccess({ userUpdated: response.user })),
					catchError((error) => (error.status == 400 ? of(setErrors({ errors: error.error.errors })) : EMPTY))
				)
			)
		)
	);
	updateSuccessUsers$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(updateSuccess),
				tap((action) => {
					this.router.navigate(['/users']);

					Swal.fire({
						title: 'Actualizado usuario!',
						text: "Usuario '" + action.userUpdated.username + "' editado con éxito!",
						icon: 'success'
					});
				})
			),
		{ dispatch: false }
	);
	removeUsers$ = createEffect(() =>
		this.actions$.pipe(
			ofType(remove),
			exhaustMap((action) =>
				this.service.remove(action.id).pipe(
					map((user) => removeSuccess({ userRemoved: user })),
					catchError((error) => (error.status == 400 ? of(setErrors({ errors: error.error.errors })) : EMPTY))
				)
			)
		)
	);
	removeSuccessUsers$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(removeSuccess),
				tap((action) => {
					this.router.navigate(['/users']);

					Swal.fire({
						title: 'Eliminado!',
						text: "Usuario '" + action.userRemoved.username + "' eliminado con éxito!",
						icon: 'success'
					});
				})
			),
		{ dispatch: false }
	);
	constructor(private actions$: Actions, private service: UserService, private router: Router) {}
}
