import React, {FC} from 'react';
import {useToken} from "../../hooks/useToken";
import {Redirect} from "react-router-dom";

export const Logout: FC = () => {
  const authData = useToken()
  authData.setToken(undefined)
  return (
    <Redirect to="/" />
  );
};