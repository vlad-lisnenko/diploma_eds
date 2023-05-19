import React, {FC} from 'react';
import {useToken} from "../hooks/useToken";

type Props = {
  authorities?: string[]
}
export const Secured: FC<Props> = props => {
  const token = useToken()

  let isValidAuthorities = !props.authorities
  const userAuthoritiesFromToken = token.tokenSummary?.userAuthorities;

  if (props.authorities) {
    isValidAuthorities = props.authorities.some(it => userAuthoritiesFromToken?.includes(it))
  }

  return !token.token || !isValidAuthorities ? null : <>{props.children}</>;
};