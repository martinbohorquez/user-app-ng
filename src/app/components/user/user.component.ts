import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/users';
import { SharingDataService } from '../../services/sharing-data.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'user',
	standalone: true,
	imports: [RouterModule],
	templateUrl: './user.component.html',
	styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
	title: string = 'Listado de usuarios!';
	users: User[] = [];

	constructor(private service: UserService, private sharingData: SharingDataService, private router: Router) {
		if (this.router.getCurrentNavigation()?.extras.state) {
			this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
		}
	}

	ngOnInit(): void {
		if (this.users == undefined || this.users == null || this.users.length == 0) {
			console.log('findAll');
			this.service.findAll().subscribe((users) => (this.users = users));
		}
	}

	onRemoveUser(id: number): void {
		this.sharingData.idUserEventEmitter.emit(id);
	}

	onSelectedUser(user: User): void {
		this.router.navigate(['/users/edit', user.id]);
	}
}
