import { createAction, props } from '@ngrx/store';
import { User } from '../models/users';

export const load = createAction('load', props<{ page: number }>());

export const findAll = createAction('findAll', props<{ users: User[] }>());
export const findAllPageable = createAction('findAll', props<{ users: User[]; paginator: any }>());
export const setPaginator = createAction('setPaginator', props<{ paginator: any }>());

export const find = createAction('find', props<{ id: number }>());

export const add = createAction('add', props<{ userNew: User }>());
export const update = createAction('update', props<{ userUpdated: User }>());
export const remove = createAction('remove', props<{ id: number }>());
