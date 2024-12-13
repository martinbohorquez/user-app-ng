import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../models/users';
import { AuthService } from '../services/auth.service';
import { SharingDataService } from '../services/sharing-data.service';
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

	constructor(private sharingData: SharingDataService, private authService: AuthService, private router: Router) {}

	ngOnInit(): void {
		this.handlerLogin();
	}

	handlerLogin() {
		this.sharingData.handlerLoginEventEmitter.subscribe(({ username, password }) => {
			this.authService.loginUser({ username, password }).subscribe({
				next: (response) => {
					const token = response.token;
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
}
