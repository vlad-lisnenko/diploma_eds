import React, {FC} from 'react';
import {Redirect, Route} from "react-router-dom";
import {useToken} from "../hooks/useToken";
import {NotFound} from './pages/NotFound';

type Props = {
  path: string
  exact?: boolean
  render: () => React.ReactNode
  authorities?: string[]
}

export const SecuredRoute: FC<Props> = props => {
  const token = useToken()

  let isValidAuthorities = !props.authorities

  const userAuthoritiesFromToken = token.tokenSummary?.userAuthorities;
  if (props.authorities) {
    isValidAuthorities = props.authorities.some(it => userAuthoritiesFromToken?.includes(it))
  }

  return !token.token || !isValidAuthorities ? <NotFound /> : (
    <Route exact={props.exact} path={props.path}
           render={() => userAuthoritiesFromToken?.includes('CHANGE_PASSWORD') && props.path !== '/change-password' ? <Redirect to="/change-password" /> : props.render()} />
  );
};
