import React, {FC} from 'react';
import {InputWithLabel} from "../../InputWithLabel/InputWithLabel";
import {Button} from "../../controls/Button";
import {Api} from "../../../api/api";
import {useDispatch} from "react-redux";
import {showMessageWithTimeout} from "../../../redux/actions/notificationActions";
import {useToken} from "../../../hooks/useToken";
import {useHistory} from "react-router-dom";
import * as yup from 'yup'
import {Formik} from 'formik';
import {handleRequestError} from "../../../utils/errorHandlingUtils";

const schema = yup.object({
  newPassword: yup.string().max(50, 'Too long').required('Required'),
  repeatedNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], "Passwords don't match").required('Required'),
})

export const ChangePasswordPage: FC = () => {
  const dispatch = useDispatch()
  const authData = useToken()
  const history = useHistory()

  return (
    <Formik initialValues={{oldPassword: '', newPassword: '', repeatedNewPassword: ''}}
            isInitialValid={false}
            validationSchema={schema}
            onSubmit={async (values, formikHelpers) => {
              formikHelpers.setSubmitting(true)
              try {
                await Api.Admin.updatePassword(values.oldPassword, values.newPassword)
                authData.setToken(undefined)
                dispatch(showMessageWithTimeout('Password has been successfully updated'))
                formikHelpers.setSubmitting(false)
                history.push("/login")
              } catch (e) {
                formikHelpers.setSubmitting(false)
                handleRequestError(dispatch, e)
              }
            }}
            render={formik => (
              <form onSubmit={formik.handleSubmit}>
                <div style={{height: '100%'}}>
                  <div className="common__flex common__flex-center common__flex-align-items-center" style={{padding: '10em 0'}}>
                    <div className="common__flex-column" style={{width: 'fit-content'}}>
                      <InputWithLabel label="Old password"
                                      value={formik.values.oldPassword}
                                      onChange={value => formik.setFieldValue('oldPassword', value)}
                                      inputType="password"/>
                      <InputWithLabel label="New password"
                                      value={formik.values.newPassword}
                                      onChange={value => formik.setFieldValue('newPassword', value)}
                                      error={!!(formik.errors.newPassword)}
                                      helperText={formik.errors.newPassword}
                                      inputType="password"/>
                      <InputWithLabel label="Repeat new password"
                                      value={formik.values.repeatedNewPassword}
                                      error={!!(formik.errors.repeatedNewPassword)}
                                      helperText={formik.errors.repeatedNewPassword}
                                      onChange={value => formik.setFieldValue('repeatedNewPassword', value)}
                                      inputType="password"/>
                      <div className="common__flex-center common__padding-1em">
                        <Button value="Change"
                                type='submit'
                                disabled={!formik.isValid}/>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}/>
  );
};