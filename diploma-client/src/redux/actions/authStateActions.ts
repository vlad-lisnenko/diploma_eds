import {ActionTypes} from "../store/store";
import {TokenWithSummary} from "../../types/TokenWithSummary";

export enum AuthActions {
  SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN',
  SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN',
  SET_INVALID_REFRESH_TOKEN = 'SET_INVALID_REFRESH_TOKEN',
  SET_ERROR_DURING_AUTHENTICATION = 'SET_ERROR_DURING_AUTHENTICATION',
  SET_REQUEST_IN_PROGRESS = 'SET_REQUEST_IN_PROGRESS',
  SKIP_AUTHENTICATION = 'SKIP_AUTHENTICATION',
  CLEAR_TOKEN = 'CLEAR_TOKEN'
}

export type AuthStateActions = ActionTypes<typeof authActionTypes>

export const authActionTypes = {
  setRefreshToken: (refreshToken: string | null) => ({
    type: AuthActions.SET_REFRESH_TOKEN,
    refreshToken
  } as const),

  setAccessToken: (token: TokenWithSummary) => ({
    type: AuthActions.SET_ACCESS_TOKEN,
    token
  } as const),

  setInvalidRefreshToken: () => ({
    type: AuthActions.SET_INVALID_REFRESH_TOKEN
  } as const),

  setErrorDuringAuthentication: () => ({
    type: AuthActions.SET_ERROR_DURING_AUTHENTICATION
  } as const),

  setRequestInProgress: () => ({
    type: AuthActions.SET_REQUEST_IN_PROGRESS
  } as const),

  setSkipAuthentication: () => ({
    type: AuthActions.SKIP_AUTHENTICATION
  } as const),

  clearToken: () => ({
    type: AuthActions.CLEAR_TOKEN
  } as const)
}