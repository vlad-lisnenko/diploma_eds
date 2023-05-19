import {AuthActions, AuthStateActions} from "../actions/authStateActions";
import {TokenWithSummary} from "../../types/TokenWithSummary";

export enum AuthState {
  GET_REFRESH_TOKEN,
  GET_ACCESS_TOKEN_BY_REFRESH,
  REFRESH_TOKEN_INVALID,
  TOKEN_SUMMARY_LOADED,
  REQUEST_IN_PROGRESS,
  ERROR_DURING_AUTHENTICATION,
  SKIP_AUTHENTICATION
}

type AuthStateType = {
  state: AuthState
  refreshToken: string | null
  tokenWithSummary?: TokenWithSummary
}

const initialState: AuthStateType = {
  state: AuthState.GET_REFRESH_TOKEN,
  refreshToken: null
}

export const authState = (state = initialState, action: AuthStateActions): AuthStateType => {
  switch (action.type) {
    case AuthActions.SET_ACCESS_TOKEN:
      return {
        ...state,
        state: AuthState.TOKEN_SUMMARY_LOADED,
        tokenWithSummary: action.token
      }

    case AuthActions.SET_ERROR_DURING_AUTHENTICATION:
      return {
        ...state,
        state: AuthState.ERROR_DURING_AUTHENTICATION
      }

    case AuthActions.SET_INVALID_REFRESH_TOKEN:
      return {
        ...state,
        state: AuthState.REFRESH_TOKEN_INVALID
      }

    case AuthActions.SET_REFRESH_TOKEN:
      return {
        ...state,
        state: AuthState.GET_ACCESS_TOKEN_BY_REFRESH,
        refreshToken: action.refreshToken
      }

    case AuthActions.SET_REQUEST_IN_PROGRESS:
      return {
        ...state,
        state: AuthState.REQUEST_IN_PROGRESS
      }

    case AuthActions.SKIP_AUTHENTICATION:
      return {
        ...state,
        state: AuthState.SKIP_AUTHENTICATION
      }

    case AuthActions.CLEAR_TOKEN:
      return {
        ...state,
        tokenWithSummary: undefined,
        refreshToken: null
      }

    default:
      return state
  }
}