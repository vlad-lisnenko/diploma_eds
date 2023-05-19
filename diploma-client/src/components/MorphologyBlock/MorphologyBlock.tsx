import React, {FC} from 'react';
import {InputWithMargins} from "../inputs/InputWithMargins";
import '../pages/AddArticlePage/WordFields.scss'
import {FormikErrors, FormikProps, FormikTouched} from "formik";
import {WordArticle} from "../../types/WordArticle";
import './MorphologyBlock.scss'
import {WordAndMorphology} from "../../types/WordAndMorphology";

type Props = {
  value: WordAndMorphology
  wordName: string
  formik: FormikProps<WordArticle>
  errors?: FormikErrors<WordAndMorphology>
  touched?: FormikTouched<WordAndMorphology>
}

export const MorphologyBlock: FC<Props> = props => {
  return (
    <div>
      <div className={"word-fields__morphology-endings row" + (!!(props.touched?.morphologyEndings && props.errors?.morphologyEndings) ? " padding-top-1-em" : '')}>
        <div className="word-fields__label">
          Morphology endings
        </div>
        <InputWithMargins value={props.value.morphologyEndings}
                          onBlur={() => props.formik.setFieldTouched(`${props.wordName}.morphologyEndings`)}
                          helperText={props.touched?.morphologyEndings ? props.errors?.morphologyEndings : undefined}
                          error={!!(props.touched?.morphologyEndings && props.errors?.morphologyEndings)}
                          onChange={value => props.formik.setFieldValue(`${props.wordName}.morphologyEndings`, value)} />
      </div>
      <div className={"word-fields__word-fields-category row"  + (!!(props.touched?.morphologyCategory && props.errors?.morphologyCategory) ? " padding-top-1-em" : '')}>
        <div className="word-fields__label">
          Morphology category
        </div>
        <InputWithMargins value={props.value.morphologyCategory}
                          onBlur={() => props.formik.setFieldTouched(`${props.wordName}.morphologyCategory`)}
                          helperText={props.touched?.morphologyCategory ? props.errors?.morphologyCategory : undefined}
                          error={!!(props.touched?.morphologyCategory && props.errors?.morphologyCategory)}
                          onChange={value => props.formik.setFieldValue(`${props.wordName}.morphologyCategory`, value)}/>
      </div>
    </div>
  );
};

export const MemoizedMorphologyBlock = React.memo(MorphologyBlock, (prevProps, nextProps) => {
  return prevProps.value.morphologyEndings === nextProps.value.morphologyEndings &&
    prevProps.value.morphologyCategory === nextProps.value.morphologyCategory &&
    prevProps.touched === nextProps.touched &&
    prevProps.errors === nextProps.errors
})