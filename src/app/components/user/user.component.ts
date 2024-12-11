import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '../../models/users';
import { AuthService } from '../../services/auth.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { UserService } from '../../services/user.service';
import { load } from '../../store/users.action';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
	selector: 'user',
	standalone: true,
	imports: [RouterModule, PaginatorComponent],
	templateUrl: './user.component.html',
	styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
	title: string = 'Listado de usuarios!';
	pageUrl: string = '/users/page';

	users: User[] = [];
	paginator: any = {};

	constructor(
		private store: Store<{ users: any }>,
		private service: UserService,
		private sharingData: SharingDataService,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.store.select('users').subscribe((state) => {
			this.users = state.users;
			this.paginator = state.paginator;
		});
	}

	ngOnInit(): void {
		// if (this.users == undefined || this.users == null || this.users.length == 0) {
		console.log('findAll');
		// this.service.findAll().subscribe((users) => (this.users = users));
		this.route.paramMap.subscribe((params) => {
			const page: number = +(params.get('page') || '0');
			if (page < 0) this.router.navigate(['/users/page', 0]);
			else {
				this.store.dispatch(load({ page }));
			}
		});
		// }
	}

	onRemoveUser(id: number): void {
		this.sharingData.idUserEventEmitter.emit(id);
	}

	// onSelectedUser(user: User): void {
	// 	this.router.navigate(['/users/edit', user.id]);
	// }

	get admin() {
		return this.authService.isAdmin();
	}
}
