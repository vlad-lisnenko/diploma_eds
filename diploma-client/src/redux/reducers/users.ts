import {User} from "../../types/User";
import {UsersActions, UsersActionTypes} from "../actions/usersActions";

type UsersState = {
  all?: User[]
}

const initialState: UsersState = {}

export const users = (state = initialState, action: UsersActionTypes): UsersState => {
  switch (action.type) {
    case UsersActions.SET_USERS:
      return {
        ...state,
        all: action.users
      }

    case UsersActions.DELETE_USER:
      return {
        ...state,
        all: state.all?.filter(it => it.id !== action.id)
      }

    default:
      return state
  }
}