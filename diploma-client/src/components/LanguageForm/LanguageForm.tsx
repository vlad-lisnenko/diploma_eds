import React, {FC} from 'react';
import {Formik, FormikProps} from 'formik';
import {Input} from "../inputs/Input";
import {Button} from "../controls/Button";
import * as yup from 'yup'
import {mapLanguageToLanguageFromData} from "../../service/languageService";
import {useDispatch, useSelector} from "react-redux";
import {dialogActions} from "../../redux/actions/dialogActions";
import {State} from "../../redux/reducers/reducers";

const inputStyles = {
  paddingLeft: '0.5em'
}

export type LanguageFormData = {
  language: string
  alphabet: string
}

type Props = {
  showDeleteButton?: boolean
  saveButtonText: string
  onSubmit: (language:LanguageFormData) => Promise<any>
  onDelete?: (id: any) => Promise<any>
  language: LanguageFormData
  languageId?: any
  showDialog: boolean
}

const schema = yup.object({
  language: yup.string().matches(/^[a-zA-Z\s]+$/gu, 'Invalid character').required('WordLanguage is required'),
  alphabet: yup.string().matches(/^[\p{Alpha}\p{M}\u200c\u200d(,\s+)]+$/gu, 'Invalid character').required('Alphabet is required')
})

export const LanguageForm: FC<Props> = props => {
  return (
    <Formik initialValues={props.language}
            isInitialValid={false}
            validationSchema={schema}
            onSubmit={async (values, formikHelpers) => {
                formikHelpers.setSubmitting(true)
                try {
                  const newValues = await props.onSubmit(values)
                  formikHelpers.setSubmitting(false)
                  formikHelpers.resetForm({values: mapLanguageToLanguageFromData(newValues)});
                } catch (e) {
                  formikHelpers.setSubmitting(false)
                  throw e
                }
            }}
            render={formik => (
              <div id="form-container">
                <form onSubmit={formik.handleSubmit}>
                  <div id="form">
                    <div>
                      <div className="common__flex common__flex-align-items-flex-end common__padding-1em">
                        <div>Language{props.languageId ? ': ' : ''}</div>
                        {props.languageId ?
                          <div style={{paddingLeft: '0.5em'}}>
                            {formik.values.language}
                          </div>:
                          <div style={inputStyles}>
                            <Input value={formik.values.language}
                                   onBlur={() => formik.setFieldTouched('language')}
                                   helperText={(formik.touched.language && formik.errors.language) || undefined}
                                   error={!!(formik.touched.language && formik.errors.language)}
                                   onChange={value => formik.setFieldValue('language', value)}/>
                          </div>
                        }
                      </div>
                    </div>
                    <div>
                      <div className="common__flex common__flex-column common__flex-justify-content-flex-end common__padding-1em">
                        <div style={{paddingBottom: '0.5em'}}>Alphabet</div>
                        <div style={{width: '40em'}}>
                          <Input multiline
                                 onBlur={() => formik.setFieldTouched('alphabet')}
                                 helperText={(formik.touched.alphabet && formik.errors.alphabet) || undefined}
                                 error={!!(formik.touched.alphabet && formik.errors.alphabet)}
                                 value={formik.values.alphabet}
                                 onChange={value => formik.setFieldValue('alphabet', value)}/>
                        </div>
                      </div>
                    </div>
                    <div className="common__flex">
                      {props.showDialog ? <DialogButton saveButtonText={props.saveButtonText} formik={formik} /> :
                        <div className="common__padding-1em">
                          <Button value={props.saveButtonText} type="submit" disabled={!formik.isValid} />
                        </div>
                      }
                      {!props.showDeleteButton ? null :
                        <div className="common__padding-1em">
                          <Button value="Delete" color="secondary" disabled={formik.isSubmitting} onClick={async () => {
                            formik.setSubmitting(true)
                            try {
                              await props.onDelete?.(props.languageId)
                              formik.setSubmitting(false)
                            } catch (e) {
                              formik.setSubmitting(false)
                              throw e
                            }
                          }
                          } />
                        </div>
                      }
                    </div>
                  </div>
                </form>
              </div>
            )} />
  );
};

type DialogButtonProps = {
  saveButtonText: string
  formik: FormikProps<LanguageFormData>
}

const DialogButton: FC<DialogButtonProps> = props => {
  const dispatch = useDispatch()
  const dialogResult = useSelector((state: State) => state.dialog.dialogOkResult)

  if (dialogResult) {
    dispatch(dialogActions.clearResult())
    props.formik.submitForm()
  }

  return (
    <div className="common__padding-1em">
      <Button value={props.saveButtonText}
              onClick={() => dispatch(dialogActions.showDialog())}
              disabled={!props.formik.isValid} />
    </div>
  )
}