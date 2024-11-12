import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { User } from '../models/users';
import { UserService } from '../services/user.service';
import { UserFormComponent } from './user-form/user-form.component';
import { UserComponent } from './user/user.component';

@Component({
	selector: 'user-app',
	standalone: true,
	imports: [UserComponent, UserFormComponent],
	templateUrl: './user-app.component.html',
	styleUrl: './user-app.component.css'
})
export class UserAppComponent implements OnInit {
	title: string = 'Listado de usuarios!';
	users: User[] = [];
	userSelected: User;
	open: boolean = false;
	private counterId = 2;

	constructor(private service: UserService) {
		this.userSelected = new User();
	}

	ngOnInit(): void {
		this.service.findAll().subscribe((users) => (this.users = users));
	}

	addUser(user: User): void {
		this.users =
			user.id > 0
				? this.users.map((u) => (u.id == user.id ? { ...user } : u))
				: [...this.users, { ...user, id: ++this.counterId }];
		Swal.fire({
			title: 'Guardado!',
			text: "Usuario '" + user.username + "' guardado con éxito!",
			icon: 'success'
		});
		this.userSelected = new User();
		this.setOpen();
	}

	removeUser(id: number): void {
		console.log(this.users);
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
				this.users = this.users.filter((user) => user.id != id);
				Swal.fire({
					title: 'Eliminado!',
					text: "Usuario '" + username + "' eliminado con éxito!",
					icon: 'success'
				});
			}
		});
	}

	selectUser(userRow: User): void {
		this.userSelected = { ...userRow };
		this.open = true;
	}

	setOpen() {
		this.open = !this.open;
	}
}
