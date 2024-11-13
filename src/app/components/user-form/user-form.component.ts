import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/users';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
	selector: 'user-form',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './user-form.component.html',
	styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
	user: User;

	constructor(private sharingData: SharingDataService, private route: ActivatedRoute) {
		this.user = new User();
	}

	ngOnInit(): void {
		this.sharingData.selectUserEventEmitter.subscribe((user) => (this.user = user));

		this.route.paramMap.subscribe((params) => {
			const id: number = +(params.get('id') || '0');
			if (id > 0) this.sharingData.findUserByIdEventEmitter.emit(id);
		});
	}

	onSubmit(userForm: NgForm): void {
		if (userForm.valid) this.sharingData.newUserEventEmitter.emit({ ...this.user });
		userForm.reset();
		userForm.resetForm();
	}

	onClear(userForm: NgForm): void {
		this.user = new User();
		userForm.reset();
		userForm.resetForm();
	}
}
