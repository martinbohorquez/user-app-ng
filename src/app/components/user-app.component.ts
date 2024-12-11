import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { User } from '../models/users';
import { AuthService } from '../services/auth.service';
import { SharingDataService } from '../services/sharing-data.service';
import { UserService } from '../services/user.service';
import { add, find, remove, setPaginator, update } from '../store/users.action';
import { findAll } from './../store/users.action';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
	selector: 'user-app',
	standalone: true,
	imports: [RouterOutlet, NavbarComponent],
	templateUrl: './user-app.component.html',
	styleUrl: './user-app.component.css'
})
export class UserAppComponent implements OnInit {
	users: User[] = [];
	user!: User;

	constructor(
		private service: UserService,
		private sharingData: SharingDataService,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<{ users: any }>
	) {
		this.store.select('users').subscribe((state) => {
			this.users = state.users;
			this.user = { ...state.user };
		});
	}

	ngOnInit(): void {
		this.addUser();
		this.removeUser();
		this.findUserById();
		this.pageUserEvent();
		this.handlerLogin();
	}

	handlerLogin() {
		this.sharingData.handlerLoginEventEmitter.subscribe(({ username, password }) => {
			console.log(username + ' ' + password);
			this.authService.loginUser({ username, password }).subscribe({
				next: (response) => {
					const token = response.token;
					console.log(token);
					const payload = this.authService.getPayload(token);

					const user = { username: payload.sub };
					const login = {
						user,
						isAuth: true,
						isAdmin: payload.isAdmin
					};
					// sessionStorage.setItem('login', JSON.stringify(login));
					this.authService.user = login;
					// sessionStorage.setItem('token', token);
					this.authService.token = token;
					this.router.navigate(['/users/page/0']);
				},
				error: (error) => {
					if (error.status) {
						Swal.fire('Error en el login', error.error.message, 'error');
					} else {
						throw error;
					}
				}
			});
		});
	}

	pageUserEvent() {
		this.sharingData.pageUsersEventEmitter.subscribe((pageable) => {
			this.store.dispatch(findAll({ users: pageable.users }));
			this.store.dispatch(setPaginator({ paginator: pageable.paginator }));
		});
	}

	findUserById() {
		this.sharingData.findUserByIdEventEmitter.subscribe((id) => {
			this.store.dispatch(find({ id }));
			this.sharingData.selectUserEventEmitter.emit(this.user);
		});
	}

	addUser(): void {
		this.sharingData.newUserEventEmitter.subscribe((user) => {
			if (user.id > 0) {
				this.service.update(user).subscribe({
					next: (userUpdated) => {
						this.store.dispatch(update({ userUpdated }));
						this.router.navigate(['/users']);

						Swal.fire({
							title: 'Actualizado usuario!',
							text: "Usuario '" + user.username + "' editado con éxito!",
							icon: 'success'
						});
					},
					error: (err) => {
						this.errorResponse(err);
					}
				});
			} else {
				this.service.create(user).subscribe({
					next: (userNew) => {
						this.store.dispatch(add({ userNew }));
						this.router.navigate(['/users']);

						Swal.fire({
							title: 'Creado nuevo usuario!',
							text: "Usuario '" + user.username + "' creado con éxito!",
							icon: 'success'
						});
					},
					error: (err) => {
						this.errorResponse(err);
					}
				});
			}
		});
	}

	private errorResponse(err: any) {
		if (err.status == 400) {
			this.sharingData.errorUserFormEventEmitter.emit(err.error.errors);
		}
	}

	removeUser(): void {
		this.sharingData.idUserEventEmitter.subscribe((id) => {
			const username: string = this.users.filter((user) => user.id == id).map(({ username }) => username)[0];

			Swal.fire({
				title: 'Seguro que desea eliminar?',
				text: "Cuidado el '" + username + "' será eliminado del sistema!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí'
			}).then((result) => {
				if (result.isConfirmed) {
					this.service.remove(id).subscribe(() => {
						this.store.dispatch(remove({ id }));

						this.router.navigateByUrl('/users/create', { skipLocationChange: true }).then(() => {
							this.router.navigate(['/users']);
						});
					});

					Swal.fire({
						title: 'Eliminado!',
						text: "Usuario '" + username + "' eliminado con éxito!",
						icon: 'success'
					});
				}
			});
		});
	}
}
