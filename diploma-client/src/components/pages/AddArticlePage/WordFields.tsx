import React, {FC, useCallback, useState} from 'react';
import {Button} from "../../controls/Button";
import './WordFields.scss'
import {Language} from "../../../types/Language";
import {WordDefinition} from "../../../types/WordDefinition";
import {Word} from "../../../types/Word";
import {InputWithMargins} from "../../inputs/InputWithMargins";
import {MemoizedMorphologyBlock} from '../../MorphologyBlock/MorphologyBlock';
import {MemoizedDefinitionsBlock} from "../../DefinitionsBlock/DefinitionsBlock";
// import {useDispatch} from "react-redux";
import {FormikErrors, FormikProps, FormikTouched} from "formik";
import {WordArticle} from "../../../types/WordArticle";
import {WordAndMorphology} from "../../../types/WordAndMorphology";
import {Checkbox} from "../../inputs/Checkbox";
import {WordLanguage} from "./WordLanguage";
import {articleFormActions} from "../../../redux/actions/articleFormActions";
import {useDispatch} from "react-redux";

type Props = {
  language: Language
  otherLanguage: Language,
  style?: any
  value: Word
  index?: number
  name: string
  showEqualMeaning: boolean
  onAddWordClick?: () => void
  onAddWordAndMorphologyClick?: () => void
  onRemoveWordClick?: (index: number) => void
  onRemoveWordAndMorphologyClick?: (index: number) => void
  errors?: FormikErrors<Word>
  touched?: FormikTouched<Word>
  formik: FormikProps<WordArticle>
  wordLanguage: WordLanguage
  words: Word[]
  wordsAndMorphologies: WordAndMorphology[]
  selectedWord: number
}

export const WordFields: FC<Props> = props => {
  return (
    <div className="word-fields" style={props.style}>
      <div className="word-fields__language-label">{props.language.language}</div>
      <div>
        {props.value.wordsAndMorphologies.map((it, index) =>
          <div>
            <WordAndMorphologyComponent value={it}
                                        wordIndex={props.index}
                                        wordAndMorphologyIndex={index}
                                        formik={props.formik}
                                        wordLanguage={props.wordLanguage}
                                        touched={props.touched && props.touched.wordsAndMorphologies && props.touched.wordsAndMorphologies[index]}
                                        //@ts-ignore
                                        errors={props.errors && props.errors.wordsAndMorphologies && props.errors.wordsAndMorphologies[index]}
                                        name={`${props.name}.wordsAndMorphologies[${index}]`}/>

            <div className="add-form__false-parallel">
              <div>False parallel</div>
              <Checkbox onChange={value => it.falseParallel = value}/>
            </div>
          </div>
        )}
      </div>

      <div>
        <AddWordAndMorphologyButtons onAddWordClick={props.onAddWordAndMorphologyClick}
                                     selectedWord={props.selectedWord}
                                     words={props.wordsAndMorphologies}
                                     onRemoveWordClick={props.onRemoveWordAndMorphologyClick}/>
      </div>

      <div className="word-fields__definitions-label">
        Definitions
      </div>

      <div>
        <MemoizedDefinitionsArray name={props.name}
                                  value={props.value}
                                  touched={props.touched?.definitions}
                                  errors={props.errors?.definitions as FormikErrors<WordDefinition>[]}
                                  showEqualMeaning={props.showEqualMeaning}
                                  formik={props.formik}
                                  otherLanguage={props.otherLanguage} />
      </div>


        <AddRemoveWordButtons onAddWordClick={props.onAddWordClick}
                              selectedWord={props.selectedWord}
                              words={props.words}
                              onRemoveWordClick={props.onRemoveWordClick}/>

    </div>
  );
};

type WordAndMorphologyProps = {
  wordIndex?: number
  wordAndMorphologyIndex: number
  formik: FormikProps<WordArticle>
  name: string
  value: WordAndMorphology
  touched?: FormikTouched<WordAndMorphology>
  errors?: FormikErrors<WordAndMorphology>
  wordLanguage: WordLanguage
}

const WordAndMorphologyComponent: FC<WordAndMorphologyProps> = props => {
  const dispatch = useDispatch()
  const [word, setRealWord] = useState(props.value.word)
  const setWord = (value: string) => {
    const newValue = {...props.value}
    newValue.word = value
    setRealWord(value)
    if (props.wordIndex !== undefined) {
      switch (props.wordLanguage) {
        case WordLanguage.FIRST: {
          dispatch(articleFormActions.setFirstLanguageWord(props.wordIndex, newValue, props.wordAndMorphologyIndex));
          break;
        }
        case WordLanguage.SECOND: {
          dispatch(articleFormActions.setSecondLanguageWord(props.wordIndex, newValue, props.wordAndMorphologyIndex));
          break
          }
      }

    }
    props.formik.validateField(`firstLanguageWords`)
    props.formik.setFieldValue(`${props.name}`, newValue)
  };
  console.log(`props.errors = ${JSON.stringify(props.errors)}`)
  console.log(`props.touched = ${JSON.stringify(props.touched)}`)
  return (
    <div>
      <div className="word-fields__word row">
        <div className="word-fields__label">
          Word
        </div>
        <InputWithMargins value={word}
                          onBlur={() => props.formik.setFieldTouched(`${props.name}.word`)}
                          helperText={props.touched?.word ? props.errors?.word : undefined}
          // error={!!(props.formik.errors.word?.word && props.formik.touched.word?.word)}
                          error={!!(props.touched?.word && props.errors?.word)}
                          onChange={setWord}/>
      </div>
      {/*<div className="row"></div>*/}
      <MemoizedMorphologyBlock value={props.value}
                               touched={props.touched}
                               errors={props.errors}
                               wordName={props.name}
                               formik={props.formik}/>
    </div>
  )
}

type DefinitionsArrayProps = {
  name: string
  value: Word
  formik: FormikProps<WordArticle>
  otherLanguage: Language,
  showEqualMeaning: boolean
  touched?: FormikTouched<WordDefinition>[]
  errors?: FormikErrors<WordDefinition>[]
}

const DefinitionsArray:FC<DefinitionsArrayProps> = props => {
  const removeCallback = useCallback(
    (removedIndex) => {
      props.formik.setFieldValue(`${props.name}.definitions`, props.value.definitions.filter((it, index) => index !== removedIndex))
    }, [props.value.definitions, props.name])
  return (
    <>
      {props.value.definitions.map((it, definitionIndex) =>
        <MemoizedDefinitionsBlock key={definitionIndex}
                                  showEqualMeaning={props.showEqualMeaning}
                                  index={definitionIndex}
                                  errors={props.errors?.[definitionIndex]}
                                  touched={props.touched?.[definitionIndex]}
                                  formik={props.formik}
                                  onDelete={removeCallback}
                                  value={it}
                                  name={`${props.name}.definitions[${definitionIndex}]`}
                                  otherLanguage={props.otherLanguage}/>)}
      <div className="word-fields__add-more">
        <Button value="Add definition" onClick={() => {
          props.formik.setFieldValue(`${props.name}.definitions`, [...props.value.definitions, createDefinition()])
        }}/>
      </div>
    </>
  )
}

const MemoizedDefinitionsArray = React.memo(DefinitionsArray, (prev, next) => {
  return (
    prev.value.definitions === next.value.definitions &&
    prev.value.definitions.length === next.value.definitions.length &&
    prev.touched === next.touched &&
    prev.errors === next.errors
  )
})

type AddWordButtonProps = {
  onAddWordClick?: () => void
  onRemoveWordClick?: (index: number) => void
  words: Word[]
  selectedWord: number
}

const AddRemoveWordButtons: FC<AddWordButtonProps> = props => {
  const words = props.words
  const selectedWord = props.selectedWord

  return (
    <div
      className={`common__flex ${words.length > 1 ? 'common__flex-justify-content-space-between' : 'common__flex-center'}`}>
      <div className="word-fields__add-more" style={{padding: '1em'}}>
        <Button disabled={words.findIndex(it => !it) !== -1} value="Add word"
                onClick={() => props.onAddWordClick?.()}/>
      </div>
      {words.length < 2 ? null :
        <div style={{padding: '1em'}}>
          <Button value="Remove word" color="secondary" onClick={() => props.onRemoveWordClick?.(selectedWord)}/>
        </div>
      }
    </div>
  )
}

type AddWordAndMorphologyButtonProps = {
  onAddWordClick?: () => void
  onRemoveWordClick?: (index: number) => void
  words: WordAndMorphology[]
  selectedWord: number
}

const AddWordAndMorphologyButtons: FC<AddWordAndMorphologyButtonProps> = props => {
  const words = props.words
  const selectedWord = props.selectedWord

  return (
    <div
      className={`common__flex ${words.length > 1 ? 'common__flex-justify-content-space-between' : 'common__flex-center'}`}>
      <div className="word-fields__add-more" style={{padding: '1em'}}>
        <Button disabled={words.findIndex(it => !it) !== -1} value="Add word"
                onClick={() => props.onAddWordClick?.()}/>
      </div>
      {words.length < 2 ? null :
        <div style={{padding: '1em'}}>
          <Button value="Remove word" color="secondary" onClick={() => props.onRemoveWordClick?.(selectedWord)}/>
        </div>
      }
    </div>
  )
}

const createDefinition = (): WordDefinition => ({
  equivalentDefinitions: [],
  equalMeaning: false,
  example: '',
  definition: ''
})

export const MemoizedWordFields = React.memo(WordFields, (prev, next) => {
  const isWordsEqual = prev.value.wordsAndMorphologies.map(it => it.word).reduce((previousValue, currentValue) => `${previousValue} ${currentValue}`) ===
    next.value.wordsAndMorphologies.map(it => it.word).reduce((previousValue, currentValue) => `${previousValue} ${currentValue}`)

  const propsAreEqual = prev.language === next.language &&
    prev.otherLanguage === next.otherLanguage &&
    prev.style === next.style &&
    prev.value === next.value &&
    isWordsEqual &&
    prev.index === next.index &&
    prev.name === next.name &&
    prev.errors === next.errors &&
    prev.touched === next.touched &&
    prev.onRemoveWordClick === next.onRemoveWordClick &&
    prev.onRemoveWordAndMorphologyClick === next.onRemoveWordAndMorphologyClick &&
    prev.words === next.words &&
    prev.wordsAndMorphologies === next.wordsAndMorphologies &&
    prev.selectedWord === next.selectedWord
  return propsAreEqual
})