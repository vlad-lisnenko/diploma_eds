import React, {FC} from 'react';
import {Language} from "../../types/Language";
import {OtherLanguageEquivalentDefinitions, WordDefinition} from "../../types/WordDefinition";
import {Input} from "../inputs/Input";
import {Checkbox} from "../inputs/Checkbox";
import {OtherLanguageDefinitionsBlock} from "../OtherLanguageDefinitionsBlock/OtherLanguageDefinitionsBlock";
import {Button} from "../controls/Button";
import '../pages/AddArticlePage/WordFields.scss';
import {FormikErrors, FormikProps, FormikTouched} from "formik";
import {WordArticle} from "../../types/WordArticle";

type Props = {
  otherLanguage: Language
  value: WordDefinition
  index: number
  onDelete: (index: number) => void
  name: string
  showEqualMeaning: boolean
  formik: FormikProps<WordArticle>
  touched?: FormikTouched<WordDefinition>
  errors?: FormikErrors<WordDefinition>
}

export const DefinitionsBlock: FC<Props> = props => {

  return (
    <div className="word-fields__definitions">
      <div className="common__flex-column">
        <div className="word-fields__definitions__definition multiline-row">
          <div className="word-fields__multiline-label" style={{paddingLeft: '0.7em', paddingBottom: '0.5em'}}>
            Definition
          </div>
          <div className="word-fields__multiline-input">
            <Input multiline
                   onBlur={() => props.formik.setFieldTouched(`${props.name}.definition`)}
                   helperText={props.touched?.definition ? props.errors?.definition : undefined}
                   // helperText={props.errors?.definition}
                   error={!!(props.touched?.definition && props.errors?.definition)}
                   onChange={value => props.formik.setFieldValue(`${props.name}.definition`, value)}
                   value={props.value.definition}/>
          </div>
        </div>
      </div>
      <div className="word-fields__definitions__definition multiline-row">
        <div className="word-fields__multiline-label" style={{paddingLeft: '0.7em', paddingBottom: '0.5em'}}>
          Stylistic marker
        </div>
        <div className="word-fields__multiline-input">
          <Input multiline
                 value={props.value.stylisticMarker}
                 onBlur={() => props.formik.setFieldTouched(`${props.name}.stylisticMarker`)}
                 helperText={props.touched?.stylisticMarker ? props.errors?.stylisticMarker : undefined}
                 error={!!(props.touched?.stylisticMarker && props.errors?.stylisticMarker)}
                 onChange={value => props.formik.setFieldValue(`${props.name}.stylisticMarker`, value)}/>
        </div>
      </div>
      <div className="word-fields__definitions__example multiline-row">
        <div className="word-fields__multiline-label" style={{paddingLeft: '0.7em', paddingBottom: '0.5em'}}>
          Example
        </div>
        <div className="word-fields__multiline-input">
          <Input multiline
                 onBlur={() => props.formik.setFieldTouched(`${props.name}.example`)}
                 // helperText={props.touched?.example ? props.errors?.example : undefined}
                 helperText={props.errors?.example}
                 error={!!(props.errors?.example)}
                 onChange={value => props.formik.setFieldValue(`${props.name}.example`, value)}
                 value={props.value.example}/>
        </div>
      </div>
      {props.index < 1 ? null :
        <div className="word-fields__equal-definition">
          <div className="word-fields__label-center">Idiosyncratic meaning</div>
          <div className="word-fields__equal-definition__checkbox">
            <Checkbox value={props.value.idiosyncraticMeaning}
                      onChange={value => props.formik.setFieldValue(`${props.name}.idiosyncraticMeaning`, value)}/>
          </div>
        </div>
      }
      {!props.showEqualMeaning ? null :
        <div className="word-fields__equal-definition">
          <div className="word-fields__label-center">Equal meaning</div>
          <div className="word-fields__equal-definition__checkbox">
            <Checkbox value={props.value.equalMeaning} onChange={value => props.formik.setFieldValue(`${props.name}.equalMeaning`, value)}/>
          </div>
        </div>
      }

      <div className="word-fields__definitions-label">
        {props.otherLanguage.language} equivalents
      </div>

      <div>
        {(props.value.equivalentDefinitions || []).map((it, otherDefinitionIndex) => (
          <div className="common__padding-1em" key={otherDefinitionIndex}>
            <OtherLanguageDefinitionsBlock
              key={otherDefinitionIndex}
              formik={props.formik}
              touched={props.touched?.equivalentDefinitions as unknown as FormikTouched<OtherLanguageEquivalentDefinitions>[]}
              errors={props.errors?.equivalentDefinitions as unknown as FormikErrors<OtherLanguageEquivalentDefinitions>[]}
              onDelete={removedIndex => props.formik.setFieldValue(`${props.name}.equivalentDefinitions`, props.value.equivalentDefinitions?.filter((it, index) => index !== removedIndex))}
              index={otherDefinitionIndex}
              name={`${props.name}.equivalentDefinitions[${otherDefinitionIndex}]`}
              value={it}/>
          </div>
        ))}
        <div className="word-fields__flex-center common__padding-1em">
          <Button value="Add equivalent"
                  onClick={() => props.formik.setFieldValue(`${props.name}.equivalentDefinitions`, [...(props.value.equivalentDefinitions || []), createEquivalentDefinition()])}/>
        </div>
        <div className="word-fields__flex-center common__padding-1em">
          <Button value="Remove definition" onClick={() => props.onDelete(props.index)} color="secondary"/>
        </div>
      </div>


    </div>
  )
}

type EquivalentDefinitionsArrayProps = {
  equivalentDefinitions: OtherLanguageEquivalentDefinitions[]
  formik: FormikProps<WordArticle>
  touched?: any
  errors?: any
  definitionName: string
}

const EquivalentDefinitionsArray: FC<EquivalentDefinitionsArrayProps> = props => {
  return (
    <>
      {props.equivalentDefinitions.map((it, otherDefinitionIndex) => (
        <div className="common__padding-1em" key={otherDefinitionIndex}>
          <OtherLanguageDefinitionsBlock
            key={otherDefinitionIndex}
            formik={props.formik}
            touched={props.touched?.[otherDefinitionIndex]}
            errors={props.errors?.[otherDefinitionIndex]}
            onDelete={removedIndex => props.formik.setFieldValue(`${props.definitionName}.equivalentDefinitions`, props.equivalentDefinitions?.filter((it, index) => index !== removedIndex))}
            index={otherDefinitionIndex}
            name={`${props.definitionName}.equivalentDefinitions[${otherDefinitionIndex}]`}
            value={it}/>
        </div>
      ))}
    </>
  )
}

const createEquivalentDefinition = (): OtherLanguageEquivalentDefinitions => ({
  definition: ''
})

export const MemoizedDefinitionsBlock = React.memo(DefinitionsBlock, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value &&
    prevProps.name === nextProps.name &&
    prevProps.index === nextProps.index &&
    prevProps.otherLanguage === nextProps.otherLanguage &&
    prevProps.errors === nextProps.errors &&
    prevProps.touched === nextProps.touched &&
    prevProps.onDelete === nextProps.onDelete
})