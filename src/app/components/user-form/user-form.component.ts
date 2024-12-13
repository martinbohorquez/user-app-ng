import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '../../models/users';
import { add, find, resetUser, setUserForm, update } from '../../store/users.action';

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

	constructor(private store: Store<{ users: any }>, private route: ActivatedRoute) {
		this.user = new User();

		this.store.select('users').subscribe((state) => {
			this.errors = state.errors;
			this.user = { ...state.user };
		});
	}

	ngOnInit(): void {
		this.store.dispatch(resetUser());
		this.route.paramMap.subscribe((params) => {
			const id: number = +(params.get('id') || '0');
			if (id > 0) {
				this.store.dispatch(find({ id }));
			}
		});
	}

	onSubmit(userForm: NgForm): void {
		this.store.dispatch(setUserForm({ user: this.user }));
		if (this.user.id > 0) {
			this.store.dispatch(update({ userUpdated: this.user }));
		} else {
			this.store.dispatch(add({ userNew: this.user }));
		}
	}

	onClear(userForm: NgForm): void {
		this.store.dispatch(resetUser());
		userForm.reset();
		userForm.resetForm();
	}
}
