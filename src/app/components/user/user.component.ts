import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/users';

@Component({
	selector: 'user',
	standalone: true,
	imports: [],
	templateUrl: './user.component.html',
	styleUrl: './user.component.css'
})
export class UserComponent {
	@Input() users: User[] = [];

	@Output() idUserEventEmitter: EventEmitter<number> = new EventEmitter();
	@Output() selectedUserEventEmitter: EventEmitter<User> = new EventEmitter();

	onRemoveUser(id: number): void {
		this.idUserEventEmitter.emit(id);
	}

	onSelectedUser(user: User): void {
		this.selectedUserEventEmitter.emit(user);
	}
}
