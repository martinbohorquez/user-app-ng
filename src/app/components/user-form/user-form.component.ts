import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/users';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
	selector: 'user-form',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './user-form.component.html',
	styleUrl: './user-form.component.css'
})
export class UserFormComponent {
	@Input() user: User;

	constructor(private sharingData: SharingDataService, private router: Router) {
		if (this.router.getCurrentNavigation()?.extras.state) {
			this.user = this.router.getCurrentNavigation()?.extras.state!['user'];
		} else {
			this.user = new User();
		}
	}

	onSubmit(userForm: NgForm): void {
		if (userForm.valid) {
			this.sharingData.newUserEventEmitter.emit({ ...this.user });
		}
		userForm.reset();
		userForm.resetForm();
	}

	onClear(userForm: NgForm): void {
		this.user = new User();
		userForm.reset();
		userForm.resetForm();
	}
}
