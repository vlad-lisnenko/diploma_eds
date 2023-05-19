import React, {FC} from 'react';
import {OtherLanguageEquivalentDefinitions} from "../../types/WordDefinition";
import '../pages/AddArticlePage/WordFields.scss';
import {Button} from "../controls/Button";
import {FormikErrors, FormikProps, FormikTouched} from "formik";
import {WordArticle} from "../../types/WordArticle";
import {Input} from "../inputs/Input";

type Props = {
  value: OtherLanguageEquivalentDefinitions
  onDelete: (index: number) => void
  index: number
  name: string
  formik: FormikProps<WordArticle>
  touched?: FormikTouched<OtherLanguageEquivalentDefinitions>[]
  errors?: FormikErrors<OtherLanguageEquivalentDefinitions>[]
}

export const OtherLanguageDefinitionsBlock: FC<Props> = props => {
  return (
    <div>
      {/*<div className="word-fields__another-language-equivalents row common__padding-1em">*/}
      <div className="common__flex common__flex-align-items-flex-end">
        {/*<div className="word-fields__label">Preceding comment</div>*/}
        <div style={{flex: '1 1 50%'}}>
          <div>Preceding comment</div>
        </div>
        <div style={{flex: '1 1 50%'}}>
          <Input value={props.value.precedingComment}
                 onBlur={() => props.formik.setFieldTouched(`${props.name}.precedingComment`)}
                 helperText={props.touched?.[props.index]?.precedingComment ? props.errors?.[props.index]?.precedingComment : undefined}
            // helperText={props.touched?.precedingComment ? props.errors?.precedingComment : undefined}
            // error={!!(props.touched?.precedingComment && props.errors?.precedingComment)}
                 error={!!(props.touched?.[props.index]?.precedingComment && props.errors?.[props.index]?.precedingComment)}
                 onChange={value => props.formik.setFieldValue(`${props.name}.precedingComment`, value)}/>
        </div>
      </div>
      {/*<div className="word-fields__another-language-equivalents row common__padding-1em">*/}
      {/*  <div className="word-fields__label">*/}
      {/*    Definition equivalent*/}
      {/*  </div>*/}
      {/*  <InputWithMargins value={props.value.definition}*/}
      {/*                    onBlur={() => props.formik.setFieldTouched(`${props.name}.definition`)}*/}
      {/*                    // helperText={props.touched?.definition ? props.errors?.definition : undefined}*/}
      {/*                    helperText={props.touched?.[props.index]?.definition ? props.errors?.[props.index]?.definition : undefined}*/}
      {/*                    // error={!!(props.touched?.definition && props.errors?.definition)}*/}
      {/*                    error={!!(props.touched?.[props.index]?.definition && props.errors?.[props.index]?.definition)}*/}
      {/*                    onChange={value => props.formik.setFieldValue(`${props.name}.definition`, value)}/>*/}
      {/*</div>*/}

      <div className="word-fields__another-language-equivalents multiline-row">
        <div className="word-fields__multiline-label" style={{paddingBottom: '0.5em'}}>
          Definition equivalent
        </div>
        <div>
          <Input multiline value={props.value.definition}
                    onBlur={() => props.formik.setFieldTouched(`${props.name}.definition`)}
                    // helperText={props.touched?.definition ? props.errors?.definition : undefined}
                    helperText={props.touched?.[props.index]?.definition ? props.errors?.[props.index]?.definition : undefined}
                    // error={!!(props.touched?.definition && props.errors?.definition)}
                    error={!!(props.touched?.[props.index]?.definition && props.errors?.[props.index]?.definition)}
                    onChange={value => props.formik.setFieldValue(`${props.name}.definition`, value)}/>
        </div>
      </div>
      <div className="common__flex common__flex-center common__padding-1em">
        <div>
          <Button value="Remove equivalent" color="secondary" onClick={() => props.onDelete(props.index)} />
        </div>
      </div>
    </div>
  )
}