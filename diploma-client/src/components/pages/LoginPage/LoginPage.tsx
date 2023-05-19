import React, {FC, useState} from 'react';
import {Input} from "../../inputs/Input";
import {Button} from "../../controls/Button";
import {Api} from "../../../api/api";
import {useToken} from "../../../hooks/useToken";
import {Redirect, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {handleRequestError} from "../../../utils/errorHandlingUtils";

const alignItemsFlexEnd = {
  alignItems: 'flex-end',
}

export const LoginPage: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const authData = useToken()
  const history = useHistory()
  const dispatch = useDispatch()

  if (authData.token) {
    return <Redirect to="/" />
  }

  return (
    <div className="common__flex-center-column common__flex-center common__flex-align-items-center" style={{padding: '10em 0'}}>
      <div className="login__form">
        <div className="common__flex" style={{padding: '1em 0'}}>
          <div className="common__padding-right-left-10px common__flex" style={alignItemsFlexEnd}>
            Email
          </div>
          <div className="common__flex-justify-content-flex-end" style={{width: '100%'}}>
            <div className="common__padding-right-left-10px">
              <Input value={email} onChange={setEmail} />
            </div>
          </div>
        </div>
        <div className="common__flex" style={{padding: '1em 0'}}>
          <div className="common__padding-right-left-10px common__flex" style={alignItemsFlexEnd}>
            Password
          </div>
          <div className="common__flex-justify-content-flex-end" style={{width: '100%'}}>
            <div className="common__padding-right-left-10px">
              <Input type="password" value={password} onChange={setPassword} />
            </div>
          </div>
        </div>
        <div className="common__padding-top-bottom-10px common__flex-center">
          <Button value="Log in"
            onClick={async () => {
              try {
                const token = await Api.Auth.getToken(email, password)
                authData.setToken(token)
                history.push('/')
              } catch (e) {
                handleRequestError(dispatch, e)
              }
            }}/>
        </div>
      </div>
    </div>
  );
};