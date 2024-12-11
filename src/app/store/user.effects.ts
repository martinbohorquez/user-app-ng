import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, exhaustMap, map } from 'rxjs';
import { User } from '../models/users';
import { UserService } from '../services/user.service';
import { findAllPageable, load } from './users.action';

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
						console.log(paginator);

						return findAllPageable({ users, paginator });
					}),
					catchError(() => EMPTY)
				)
			)
		)
	);
	constructor(private actions$: Actions, private service: UserService, private router: Router) {}
}
