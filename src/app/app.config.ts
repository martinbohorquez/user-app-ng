import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { authReducer } from './store/auth/auth.reducer';
import { UserEffects } from './store/users/users.effects';
import { usersReducer } from './store/users/users.reducer';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withInterceptors([tokenInterceptor])),
		provideStore({
			users: usersReducer,
			auth: authReducer
		}),
		provideEffects(UserEffects),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
	]
};
