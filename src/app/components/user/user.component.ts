import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { User } from '../../models/users';
import { AuthService } from '../../services/auth.service';
import { load, remove } from '../../store/users/users.action';
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
		this.route.paramMap.subscribe((params) => {
			const page: number = +(params.get('page') || '0');
			if (page < 0) this.router.navigate(['/users/page', 0]);
			else {
				this.store.dispatch(load({ page }));
			}
		});
	}

	onRemoveUser(id: number): void {
		const username: string = this.users.filter((user) => user.id == id).map(({ username }) => username)[0];

		Swal.fire({
			title: 'Seguro que desea eliminar?',
			text: "Cuidado el usuario '" + username + "' será eliminado del sistema!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sí'
		}).then((result) => {
			if (result.isConfirmed) {
				this.store.dispatch(remove({ id }));
			}
		});
	}

	get admin() {
		return this.authService.isAdmin();
	}
}
