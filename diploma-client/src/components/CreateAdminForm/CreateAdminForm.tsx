import React, {FC, useState} from 'react';
import {Input} from "../inputs/Input";
import {Button} from "../controls/Button";
import {Api} from "../../api/api";
import {useDispatch} from "react-redux";
import {showMessageWithTimeout} from "../../redux/actions/notificationActions";
import * as yup from 'yup'
import {handleRequestError} from "../../utils/errorHandlingUtils";

const schema = yup.string().required('Email is required').email('Invalid email').max(50, 'Too long')

export const CreateAdminForm: FC = () => {
  const [email, setFormEmail] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()

  const setEmail = (value: string) => {
    schema.validate(value).then(() => setError('')).catch(error => setError(error.errors[0]))
    setFormEmail(value)
  }

  return (
    <div className="common__flex common__flex-column common__flex-align-items-center" style={{padding: '6em 0'}}>
      <div style={{width: 'fit-content'}}>
        <div className="common__flex">
          <div className="common__flex" style={{alignItems: 'flex-end'}}>
            <div>Email</div>
          </div>
          <div style={{padding: '0 0 0 1em'}}>
            <Input value={email}
                   error={!!(error)}
                   helperText={error}
                   onChange={setEmail} />
          </div>
        </div>
        <div className="common__flex-center" style={{padding: '1em 0'}}>
          <Button value="Create"
                  disabled={!!(error || !email)}
          onClick={async () => {
            try {
              await Api.Admin.createAdmin(email);
              dispatch(showMessageWithTimeout('Admin successfully created, please wait email with password'))
            } catch (e){
              handleRequestError(dispatch, e)
            }
          }}/>
        </div>
      </div>
    </div>
  );
};