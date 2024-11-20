import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/users';
import { SharingDataService } from '../../services/sharing-data.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'user-form',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './user-form.component.html',
	styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
	user: User;
	errors: any = {};

	constructor(private sharingData: SharingDataService, private route: ActivatedRoute, private service: UserService) {
		this.user = new User();
	}

	ngOnInit(): void {
		this.sharingData.selectUserEventEmitter.subscribe((user) => (this.user = user));
		this.sharingData.errorUserFormEventEmitter.subscribe((errors) => (this.errors = errors));

		this.route.paramMap.subscribe((params) => {
			const id: number = +(params.get('id') || '0');
			if (id > 0) {
				this.sharingData.findUserByIdEventEmitter.emit(id);
				// this.service.findById(id).subscribe((user) => (this.user = user)); -- Consulta al backend
			}
		});
	}

	onSubmit(userForm: NgForm): void {
		// if (userForm.valid)
		this.sharingData.newUserEventEmitter.emit({ ...this.user });
		// userForm.reset();
		// userForm.resetForm();
	}

	onClear(userForm: NgForm): void {
		this.user = new User();
		userForm.reset();
		userForm.resetForm();
	}
}
