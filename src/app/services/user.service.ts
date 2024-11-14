import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private url: string = 'http://localhost:8080/api/users';
	private users: User[] = [];

	constructor(private http: HttpClient) {}

	findAll(): Observable<User[]> {
		return this.http.get<User[]>(this.url);
	}

	findById(id: number): Observable<User> {
		return this.http.get<User>(`${this.url}/${id}`);
	}

	create(user: User): Observable<User> {
		return this.http.post<User>(this.url, user);
	}

	update(user: User): Observable<User> {
		return this.http.put<User>(`${this.url}/${user.id}`, user);
	}
}
