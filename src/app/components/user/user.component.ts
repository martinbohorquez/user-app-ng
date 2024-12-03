import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../models/users';
import { AuthService } from '../../services/auth.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { UserService } from '../../services/user.service';
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
		private service: UserService,
		private sharingData: SharingDataService,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) {
		if (this.router.getCurrentNavigation()?.extras.state) {
			this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
			this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];
		}
	}

	ngOnInit(): void {
		if (this.users == undefined || this.users == null || this.users.length == 0) {
			console.log('findAll');
			// this.service.findAll().subscribe((users) => (this.users = users));
			this.route.paramMap.subscribe((params) => {
				const page: number = +(params.get('page') || '0');
				if (page < 0) this.router.navigate(['/users/page', 0]);
				else {
					this.service.findAllPegeable(page).subscribe((pegeable) => {
						if (page > pegeable.totalPages - 1) this.router.navigate(['/users/page', pegeable.totalPages - 1]);
						else {
							this.users = pegeable.content as User[];
							this.paginator = pegeable;
							this.sharingData.pageUsersEventEmitter.emit({ users: this.users, paginator: this.paginator });
						}
					});
				}
			});
		}
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
