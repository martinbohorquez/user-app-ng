import { Component, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/users';

@Component({
	selector: 'user',
	standalone: true,
	imports: [RouterModule],
	templateUrl: './user.component.html',
	styleUrl: './user.component.css'
})
export class UserComponent {
	title: string = 'Listado de usuarios!';
	users: User[] = [];

	idUserEventEmitter: EventEmitter<number> = new EventEmitter();
	selectedUserEventEmitter: EventEmitter<User> = new EventEmitter();

	constructor(private router: Router) {
		this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
	}

	onRemoveUser(id: number): void {
		this.idUserEventEmitter.emit(id);
	}

	onSelectedUser(user: User): void {
		this.selectedUserEventEmitter.emit(user);
	}
}
