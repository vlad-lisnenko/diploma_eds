import {User} from "../../types/User";
import {ActionTypes} from "../store/store";
import {ThunkResult} from "../../types/ThunkResult";
import {Api} from "../../api/api";

export enum UsersActions {
  SET_USERS = 'SET_USERS',
  DELETE_USER = 'DELETE_USER'
}

export type UsersActionTypes = ActionTypes<typeof usersActions>

export const usersActions = {
  setUsers: (users: User[]) => ({
    type: UsersActions.SET_USERS,
    users
  } as const),

  deleteUser: (id: any) => ({
    type: UsersActions.DELETE_USER,
    id
  } as const)
}

export const fetchUsers = (): ThunkResult => async dispatch => {
  const users = (await Api.Admin.findAll()).data
  dispatch(usersActions.setUsers(users))
}

export const deleteAdmin = (id: any): ThunkResult => async dispatch => {
  await Api.Admin.deleteById(id)
  dispatch(usersActions.deleteUser(id))
}