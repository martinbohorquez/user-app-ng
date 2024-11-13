import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/users';

@Injectable({
	providedIn: 'root'
})
export class SharingDataService {
	private _newUserEventEmitter: EventEmitter<User> = new EventEmitter();
	private _idUserEventEmitter: EventEmitter<number> = new EventEmitter();
	private _findUserByIdEventEmitter: EventEmitter<number> = new EventEmitter();
	private _selectUserEventEmitter: EventEmitter<User> = new EventEmitter();

	constructor() {}

	get newUserEventEmitter(): EventEmitter<User> {
		return this._newUserEventEmitter;
	}

	get idUserEventEmitter(): EventEmitter<number> {
		return this._idUserEventEmitter;
	}

	get findUserByIdEventEmitter(): EventEmitter<number> {
		return this._findUserByIdEventEmitter;
	}

	get selectUserEventEmitter(): EventEmitter<User> {
		return this._selectUserEventEmitter;
	}
}
