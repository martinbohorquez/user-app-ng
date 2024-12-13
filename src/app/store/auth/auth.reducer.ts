import { createReducer, on } from '@ngrx/store';
import { login, logout } from './auth.actions';

export const initialLogin = {
	isAuth: false,
	isAdmin: false,
	user: undefined
};

const initialState = JSON.parse(sessionStorage.getItem('login') || JSON.stringify(initialLogin));

export const authReducer = createReducer(
	initialState,
	on(login, (state, { login }) => ({
		isAuth: login.isAuth,
		isAdmin: login.isAdmin,
		user: login.user
	})),
	on(logout, (state) => ({ ...initialLogin }))
);
