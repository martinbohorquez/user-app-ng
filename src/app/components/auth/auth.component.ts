import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from '../../models/users';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
	selector: 'app-auth',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './auth.component.html',
	styleUrl: './auth.component.css'
})
export class AuthComponent {
	user: User;

	constructor(private sharingData: SharingDataService) {
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
			this.sharingData.handlerLoginEventEmitter.emit({ username: this.user.username, password: this.user.password });
		}
	}
}
