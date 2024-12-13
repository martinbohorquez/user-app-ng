import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../models/users';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-auth',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './auth.component.html',
	styleUrl: './auth.component.css'
})
export class AuthComponent {
	user: User;

	constructor(private authService: AuthService, private router: Router) {
		this.user = new User();
	}

	onSubmit() {
		if (!this.user.username || !this.user.password) {
			Swal.fire({
				title: 'Error de validación',
				text: 'Usuario y password requeridos!',
				icon: 'error'
			});
		} else {
			this.authService.loginUser({ username: this.user.username, password: this.user.password }).subscribe({
				next: (response) => {
					const token = response.token;
					const payload = this.authService.getPayload(token);

					this.authService.token = token;
					this.authService.user = {
						user: { username: payload.sub },
						isAuth: true,
						isAdmin: payload.isAdmin
					};

					this.router.navigate(['/users']);
				},
				error: (error) => {
					if (error.status) {
						Swal.fire('Error en el login', error.error.message, 'error');
					} else {
						throw error;
					}
				}
			});
		}
	}
}
