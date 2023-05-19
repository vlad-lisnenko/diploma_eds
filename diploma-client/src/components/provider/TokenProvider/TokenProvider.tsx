import React, {FC} from 'react';
import {Api} from "../../../api/api";
import {Token} from '../../../types/Token';
import {TokenSummary} from "../../../types/TokenSummary";
import {TokenWithSummary} from "../../../types/TokenWithSummary";
import {AuthState} from "../../../redux/reducers/authState";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../../redux/reducers/reducers";
import {authActionTypes} from "../../../redux/actions/authStateActions";
import {showMessageWithTimeout} from "../../../redux/actions/notificationActions";

const refreshTokenKey = "refreshToken";

const refreshTokenCallback = (): Promise<TokenWithSummary> => {
  const refreshToken = localStorage.getItem(refreshTokenKey);
  if (!refreshToken) {
    return Promise.reject();
  }

  return Api.Auth.refreshToken(refreshToken)
};

type AuthProviderValue = {
  token?: Token
  tokenSummary?: TokenSummary
  setToken: (token?: TokenWithSummary) => void
}
export const TokenContext = React.createContext<AuthProviderValue>({} as AuthProviderValue);

let refreshInterval: NodeJS.Timeout;

export const TokenProvider: FC = props => {
  const authState = useSelector((state: State) => state.authState)
  const dispatch = useDispatch()

  const value: AuthProviderValue = {
    token: authState.tokenWithSummary?.token,
    tokenSummary: authState.tokenWithSummary?.tokenSummary,
    setToken(token) {
      clearInterval(refreshInterval);
      if (!token) {
        localStorage.removeItem(refreshTokenKey);
      } else {
        localStorage.setItem(refreshTokenKey, token.token.refreshToken);
        refreshInterval =
          setInterval( async () => {
            try {
              const newToken = await refreshTokenCallback()
              Api.setAuthToken(newToken.token.accessToken);
              dispatch(authActionTypes.setAccessToken(newToken))
              localStorage.setItem(refreshTokenKey, newToken.token.refreshToken);
            } catch (e) {
              localStorage.removeItem(refreshTokenKey)
              dispatch(authActionTypes.clearToken())
            }
          }, (token.token.expiresIn - 30) * 1000);
      }
      Api.setAuthToken(token?.token.accessToken || '');

      if (token) {
        dispatch(authActionTypes.setAccessToken(token))
      } else {
        dispatch(authActionTypes.clearToken())
      }
    }
  };

  switch (authState.state) {
    case AuthState.GET_REFRESH_TOKEN:
      const refreshToken = localStorage.getItem(refreshTokenKey)
      if (refreshToken) {
        dispatch(authActionTypes.setRefreshToken(refreshToken))
      } else {
        dispatch(authActionTypes.setSkipAuthentication())
      }
      return null;
    case AuthState.GET_ACCESS_TOKEN_BY_REFRESH:
      Api.Auth.refreshToken(authState.refreshToken as string)
        .then(token => {
          value.setToken(token)
          dispatch(authActionTypes.setAccessToken(token))
        })
        .catch(() => dispatch(authActionTypes.setInvalidRefreshToken()))
      return null

    case AuthState.REFRESH_TOKEN_INVALID:
      return (
        <TokenContext.Provider value={value}>
          {props.children}
        </TokenContext.Provider>
      );

    case AuthState.TOKEN_SUMMARY_LOADED:
      return (
        <TokenContext.Provider value={value}>
          {props.children}
        </TokenContext.Provider>
      )

    case AuthState.ERROR_DURING_AUTHENTICATION:
      dispatch(showMessageWithTimeout("Error during authentication"))
      return (
        <TokenContext.Provider value={value}>
          {props.children}
        </TokenContext.Provider>
      )

    case AuthState.REQUEST_IN_PROGRESS:
      return null

    case AuthState.SKIP_AUTHENTICATION:
      break
  }

  return (
    <TokenContext.Provider value={value}>
      {props.children}
    </TokenContext.Provider>
  );
};
