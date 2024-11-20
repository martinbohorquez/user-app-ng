import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../models/users';
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

	constructor(private service: UserService, private sharingData: SharingDataService, private router: Router) {}

	ngOnInit(): void {
		this.service.findAll().subscribe((users) => (this.users = users));
		this.usersInitial = this.users;
		this.addUser();
		this.removeUser();
		this.findUserById();
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

						this.router.navigate(['/users'], { state: { users: this.users } });

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

						this.router.navigate(['/users'], { state: { users: this.users } });

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
							this.router.navigate(['/users'], { state: { users: this.users } });
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
