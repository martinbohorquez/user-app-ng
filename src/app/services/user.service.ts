import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/users';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private users: User[] = [
		{
			id: 1,
			name: 'Kate',
			lastname: 'Sam',
			email: 'kate.sam@gmail.com',
			username: 'katesam',
			password: '123456'
		},
		{
			id: 2,
			name: 'Jim',
			lastname: 'Mez',
			email: 'jim.mez@gmail.com',
			username: 'jimmez',
			password: '123456'
		}
	];

	constructor() {}

	findAll(): Observable<User[]> {
		return of(this.users);
	}
}
