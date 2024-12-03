import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../models/users';
import { AuthService } from '../services/auth.service';
import { SharingDataService } from '../services/sharing-data.service';
import { UserService } from '../services/user.service';
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
	usersInitial: User[] = [];
	paginator: any = {};

	constructor(
		private service: UserService,
		private sharingData: SharingDataService,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		// this.service.findAll().subscribe((users) => (this.users = users));
		// this.route.paramMap.subscribe((params) => {
		// 	const page: number = +(params.get('page') || '0');
		// 	this.service.findAllPegeable(page).subscribe((pegeable) => (this.users = pegeable.content as User[]));
		// });
		this.usersInitial = this.users;
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
		this.sharingData.pageUsersEventEmitter.subscribe((pegeable) => {
			this.users = pegeable.users;
			this.paginator = pegeable.paginator;
		});
	}

	findUserById() {
		this.sharingData.findUserByIdEventEmitter.subscribe((id) => {
			const user = this.users.find((user) => user.id == id);
			this.sharingData.selectUserEventEmitter.emit(user);
		});
	}

	addUser(): void {
		this.sharingData.newUserEventEmitter.subscribe((user) => {
			if (user.id > 0) {
				this.service.update(user).subscribe({
					next: (userUpdated) => {
						this.users = this.users.map((u) => (u.id == userUpdated.id ? { ...userUpdated } : u));

						this.router.navigate(['/users/'], { state: { users: this.users, paginator: this.paginator } });

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
						this.users = [...this.users, { ...userNew }];

						this.router.navigate([
							'/users/page',
							(this.paginator.totalElements + 1) % this.paginator.size == 0
								? this.paginator.totalPages - 1
								: this.paginator.totalPages
						]);
						// this.router.navigate(['/users'], { state: { users: this.users, paginator: this.paginator } });

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
			// console.log(err.error);
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
						this.users = this.users.filter((user) => user.id != id);

						this.router.navigateByUrl('/users/create', { skipLocationChange: true }).then(() => {
							this.router.navigate([
								'/users/page',
								(this.paginator.totalElements - 1) % this.paginator.size == 0
									? this.paginator.number - 1
									: this.paginator.number
							]);
							// this.router.navigate(['/users'], { state: { users: this.users, paginator: this.paginator } });
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
