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
	private _errorUserFormEventEmitter: EventEmitter<User> = new EventEmitter();
	private _pageUsersEventEmitter: EventEmitter<any> = new EventEmitter();
	private _handlerLoginEventEmitter: EventEmitter<any> = new EventEmitter();

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

	get errorUserFormEventEmitter(): EventEmitter<User> {
		return this._errorUserFormEventEmitter;
	}

	get pageUsersEventEmitter(): EventEmitter<any> {
		return this._pageUsersEventEmitter;
	}

	get handlerLoginEventEmitter(): EventEmitter<any> {
		return this._handlerLoginEventEmitter;
	}
}
