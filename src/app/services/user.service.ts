import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_URL } from '../config/config';
import { User } from '../models/users';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private url: string = `${BACKEND_URL}/api/users`;

	constructor(private http: HttpClient) {}

	findAll(): Observable<User[]> {
		return this.http.get<User[]>(this.url);
	}

	findAllPageable(page: number): Observable<any> {
		return this.http.get<any>(`${this.url}/page/${page}`);
	}

	findById(id: number): Observable<User> {
		return this.http.get<User>(`${this.url}/${id}`);
	}

	create(user: User): Observable<{ mensaje: string; user: User }> {
		return this.http.post<{ mensaje: string; user: User }>(this.url, user);
	}

	update(user: User): Observable<{ mensaje: string; user: User }> {
		return this.http.put<{ mensaje: string; user: User }>(`${this.url}/${user.id}`, user);
	}

	remove(id: number): Observable<User> {
		return this.http.delete<User>(`${this.url}/${id}`);
	}
}
