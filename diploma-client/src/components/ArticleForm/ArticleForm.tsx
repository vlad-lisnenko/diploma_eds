import React, {FC, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../redux/reducers/reducers";
import {Word} from "../../types/Word";
import {MemoizedWordFields} from "../pages/AddArticlePage/WordFields";
import {articleFormActions} from "../../redux/actions/articleFormActions";
import {SecondWordsList} from "../SecondWordsList/SecondWordsList";
import {Button} from "../controls/Button";
import {WordDefinition} from "../../types/WordDefinition";
import {WordArticle} from "../../types/WordArticle";
import {FormikErrors, FormikProps, FormikTouched, withFormik} from 'formik';
import * as yup from 'yup'
import {WordLanguage} from "../pages/AddArticlePage/WordLanguage";
import {FirstWordsList} from "../FirstWordsList/FirstWordsList";
import {WordAndMorphology} from "../../types/WordAndMorphology";
import {WordsAndMorphologyListMetadata} from "../../redux/reducers/articleForm";

type Props = {
  article: WordArticle
  onSubmit: (article: WordArticle) => Promise<void>
  submitButtonText?: string
}

const wordStyle = {paddingRight: '7em'}

const wordAndMorphologySchema = yup.object().shape({
  word: yup.string().required('Word is required').max(50, 'Only 50 characters allowed')
})

const wordSchema = yup.object().shape({
  wordsAndMorphologies: yup.array().of(wordAndMorphologySchema)
})

const schema = yup.object().shape({
  firstLanguageWords: yup.array().of(wordSchema),
  otherLanguageWords: yup.array().of(wordSchema)
})

const createEmptyWordAndMorphology = () => ({
  word: '',
  morphologyEndings: '',
  morphologyCategory: '',
  falseParallel: false
});

const ArticleForm: FC<Props & FormikProps<WordArticle>> = (props) => {
  const activeSecondWord = useSelector((state: State) => state.articleForm.activeSecondWord)
  const activeFirstWord = useSelector((state: State) => state.articleForm.activeFirstWord)
  const {article, onSubmit, submitButtonText, ...formik} = props
  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage)
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)

  const dispatch = useDispatch()

  useEffect(() => {
    props.setValues(article)
    dispatch(articleFormActions.setFirstLanguageWords(props.article.firstLanguageWords.map(mapWordsToWordsAndMorphologyListMetadata)))
    dispatch(articleFormActions.setSecondLanguageWords(props.article.otherLanguageWords.map(mapWordsToWordsAndMorphologyListMetadata)))
  }, [article])

  const removeFirstWordCallback = useCallback(wordIndex => {
    const firstLanguageWords = formik.values.firstLanguageWords.filter((it, index) => {
      return index !== wordIndex
    })

    dispatch(articleFormActions.setFirstLanguageWords(firstLanguageWords.map(mapWordsToWordsAndMorphologyListMetadata)))
    const activeWord = activeFirstWord.wordIndex === wordIndex ? wordIndex === 0 ? 0 : wordIndex - 1 : activeFirstWord.wordIndex
    dispatch(articleFormActions.setActiveFirstWord({wordIndex: activeWord, wordAndMorphologyIndex: 0}))
    formik.setFieldValue('firstLanguageWords', firstLanguageWords)
  }, [formik.values.firstLanguageWords, activeFirstWord])

  const removeSecondWordCallback = useCallback(wordIndex => {
    const secondLanguageWords = formik.values.otherLanguageWords.filter((it, index) => {
      return index !== wordIndex
    })

    dispatch(articleFormActions.setSecondLanguageWords(secondLanguageWords.map(mapWordsToWordsAndMorphologyListMetadata)))
    const activeWord = activeSecondWord.wordIndex === wordIndex ? wordIndex === 0 ? 0 : wordIndex - 1 : activeSecondWord.wordIndex
    dispatch(articleFormActions.setActiveSecondWord({wordIndex: activeWord, wordAndMorphologyIndex: 0}))
    formik.setFieldValue('otherLanguageWords', secondLanguageWords)
  }, [formik.values.otherLanguageWords, activeSecondWord])

  const removeFirstWordAndMorphologyCallback = useCallback(wordIndex => {
    const firstWordsAndMorphologies = formik.values.firstLanguageWords[wordIndex].wordsAndMorphologies;
    const wordsAndMorphologies = firstWordsAndMorphologies.slice(0, firstWordsAndMorphologies.length - 1)
    const wordAndMorphologyIndex = firstWordsAndMorphologies.length - 1
    const activeWordAndMorphology = activeFirstWord.wordIndex === wordIndex &&
      activeFirstWord.wordAndMorphologyIndex === wordAndMorphologyIndex ?
      wordAndMorphologyIndex === 0 ? 0 : wordAndMorphologyIndex - 1 : activeFirstWord.wordAndMorphologyIndex

    dispatch(articleFormActions.setActiveFirstWord({wordIndex, wordAndMorphologyIndex: activeWordAndMorphology}))
    dispatch(articleFormActions.setFirstLanguageWords([
      ...formik.values.firstLanguageWords.filter((it, index) => index < activeFirstWord.wordIndex).map(mapWordsToWordsAndMorphologyListMetadata),
      {wordIndex: activeFirstWord.wordIndex, wordsAndMorphologies: wordsAndMorphologies},
      ...formik.values.firstLanguageWords.filter((it, index) => index > activeFirstWord.wordIndex).map(mapWordsToWordsAndMorphologyListMetadata)
    ]))
    formik.setFieldValue(`firstLanguageWords[${wordIndex}].wordsAndMorphologies`, wordsAndMorphologies)

  }, [formik.values.firstLanguageWords, activeFirstWord])

  const removeSecondWordAndMorphologyCallback = useCallback(wordIndex => {
    const secondWordsAndMorphologies = formik.values.otherLanguageWords[wordIndex].wordsAndMorphologies;
    const wordsAndMorphologies = secondWordsAndMorphologies.slice(0, secondWordsAndMorphologies.length - 1)
    const wordAndMorphologyIndex = secondWordsAndMorphologies.length - 1
    const activeWordAndMorphology = activeSecondWord.wordIndex === wordIndex &&
    activeSecondWord.wordAndMorphologyIndex === wordAndMorphologyIndex ?
      wordAndMorphologyIndex === 0 ? 0 : wordAndMorphologyIndex - 1 : activeSecondWord.wordAndMorphologyIndex

    dispatch(articleFormActions.setActiveSecondWord({wordIndex, wordAndMorphologyIndex: activeWordAndMorphology}))
    dispatch(articleFormActions.setSecondLanguageWords([
      ...formik.values.otherLanguageWords.filter((it, index) => index < activeSecondWord.wordIndex).map(mapWordsToWordsAndMorphologyListMetadata),
      {wordIndex: activeSecondWord.wordIndex, wordsAndMorphologies: wordsAndMorphologies},
      ...formik.values.otherLanguageWords.filter((it, index) => index > activeSecondWord.wordIndex).map(mapWordsToWordsAndMorphologyListMetadata)
    ]))
    formik.setFieldValue(`otherLanguageWords[${wordIndex}].wordsAndMorphologies`, wordsAndMorphologies)

  }, [formik.values.otherLanguageWords, activeSecondWord])

  return !firstLanguage || !secondLanguage ? null :
    <div className="add-form">
      <div className="common__flex common__height-100-width-100">
        <div style={{flex: `1 1 ${100/3}%`}} className="common__flex-justify-content-flex-end">
          <div style={{paddingRight: '2em'}}>
            <div hidden={formik.values.firstLanguageWords.length < 2} style={{padding: '1em 0 1em 0'}}>
              <h3>{firstLanguage.language} words</h3>
              <FirstWordsList/>
            </div>
          </div>
        </div>
        <div className="add-form__words-form" style={{flex: `1 1 ${100/3}%`}}>
          <div className="common__flex common__flex-center">
            <div>
              {formik.values.firstLanguageWords.map((it, index) =>
                index !== activeFirstWord.wordIndex ? null :
                  <MemoizedWordFields key={index}
                                      selectedWord={activeFirstWord.wordIndex}
                                      showEqualMeaning={false}
                                      wordLanguage={WordLanguage.FIRST}
                                      index={index}
                                      errors={formik.errors.firstLanguageWords?.[index] as FormikErrors<Word> | undefined}
                                      touched={formik.touched.firstLanguageWords?.[index] as FormikTouched<Word> | undefined}
                                      language={firstLanguage}
                                      formik={formik}
                                      value={it}
                                      name={`firstLanguageWords[${index}]`}
                                      otherLanguage={secondLanguage}
                                      onAddWordClick={() => {
                                        const emptyWord = createEmptyWord();
                                        const firstLanguageWords = [...formik.values.firstLanguageWords, emptyWord]
                                        dispatch(articleFormActions.setFirstLanguageWords(firstLanguageWords.map(mapWordsToWordsAndMorphologyListMetadata)))
                                        dispatch(articleFormActions.setActiveFirstWord({wordIndex: firstLanguageWords.length - 1, wordAndMorphologyIndex: 0}))
                                        formik.setFieldValue('firstLanguageWords', firstLanguageWords)
                                      }}
                                      onAddWordAndMorphologyClick={() => {
                                        const emptyWordAndMorphology: WordAndMorphology = createEmptyWordAndMorphology()
                                        const wordsAndMorphologies = [...formik.values.firstLanguageWords[activeFirstWord.wordIndex].wordsAndMorphologies, emptyWordAndMorphology]
                                        const firstLanguageWords: WordsAndMorphologyListMetadata[] = [
                                          ...(formik.values.firstLanguageWords.filter((it, currentIndex) => currentIndex < activeFirstWord.wordIndex).map(mapWordsToWordsAndMorphologyListMetadata)),
                                            {wordIndex: activeFirstWord.wordIndex, wordsAndMorphologies: wordsAndMorphologies},
                                          ...(formik.values.firstLanguageWords.filter((it, currentIndex) => currentIndex > activeFirstWord.wordIndex).map(mapWordsToWordsAndMorphologyListMetadata))
                                        ]

                                        dispatch(articleFormActions.setFirstLanguageWords(firstLanguageWords))
                                        formik.setFieldValue(`firstLanguageWords[${index}].wordsAndMorphologies`, wordsAndMorphologies)
                                      }}
                                      words={formik.values.firstLanguageWords}
                                      wordsAndMorphologies={formik.values.firstLanguageWords[activeFirstWord.wordIndex].wordsAndMorphologies}
                                      onRemoveWordAndMorphologyClick={removeFirstWordAndMorphologyCallback}
                                      onRemoveWordClick={removeFirstWordCallback}/>

              )}
            </div>

            <div style={{paddingLeft: '7em'}}>
              {formik.values.otherLanguageWords.map((it, index) =>
                index !== activeSecondWord.wordIndex ? null :
                  <MemoizedWordFields key={index}
                                      selectedWord={activeSecondWord.wordIndex}
                                      index={index}
                                      wordLanguage={WordLanguage.SECOND}
                                      errors={formik.errors.otherLanguageWords?.[index] as FormikErrors<Word> | undefined}
                                      touched={formik.touched.otherLanguageWords?.[index] as FormikTouched<Word> | undefined}
                                      language={secondLanguage}
                                      formik={formik}
                                      showEqualMeaning={true}
                                      value={it}
                                      name={`otherLanguageWords[${index}]`}
                                      otherLanguage={firstLanguage}
                                      onAddWordClick={() => {
                                        const emptyWord = createEmptyWord();
                                        const secondLanguageWords = [...formik.values.otherLanguageWords, emptyWord]
                                        dispatch(articleFormActions.setSecondLanguageWords(secondLanguageWords.map(mapWordsToWordsAndMorphologyListMetadata)))
                                        dispatch(articleFormActions.setActiveSecondWord({wordIndex: secondLanguageWords.length - 1, wordAndMorphologyIndex: 0}))
                                        formik.setFieldValue('otherLanguageWords', secondLanguageWords)
                                      }}
                                      onAddWordAndMorphologyClick={() => {
                                        const emptyWordAndMorphology: WordAndMorphology = createEmptyWordAndMorphology()
                                        const wordsAndMorphologies = [...formik.values.otherLanguageWords[activeSecondWord.wordIndex].wordsAndMorphologies, emptyWordAndMorphology]
                                        const secondLanguageWords: WordsAndMorphologyListMetadata[] = [
                                          ...(formik.values.otherLanguageWords.filter((it, currentIndex) => currentIndex < activeSecondWord.wordIndex).map(mapWordsToWordsAndMorphologyListMetadata)),
                                          {wordIndex: activeSecondWord.wordIndex, wordsAndMorphologies: wordsAndMorphologies},
                                          ...(formik.values.otherLanguageWords.filter((it, currentIndex) => currentIndex > activeSecondWord.wordIndex).map(mapWordsToWordsAndMorphologyListMetadata))
                                        ]

                                        dispatch(articleFormActions.setSecondLanguageWords(secondLanguageWords))
                                        formik.setFieldValue(`otherLanguageWords[${index}].wordsAndMorphologies`, wordsAndMorphologies)
                                      }}
                                      words={formik.values.otherLanguageWords}
                                      wordsAndMorphologies={formik.values.otherLanguageWords[activeSecondWord.wordIndex].wordsAndMorphologies}
                                      onRemoveWordAndMorphologyClick={removeSecondWordAndMorphologyCallback}
                                      onRemoveWordClick={removeSecondWordCallback}/>

              )}
            </div>
          </div>
        </div>
        <div style={{paddingLeft: '2em', flex: `1 1 ${100/3}%`}}>
          <div hidden={formik.values.otherLanguageWords.length < 2} style={{padding: '1em 0 1em 0'}}>
            <h3>{secondLanguage.language} words</h3>
            <SecondWordsList/>
          </div>
        </div>
      </div>
      <div>
        <Button value={props.submitButtonText || "Save"}
                disabled={!formik.isValid}
                onClick={() => props.onSubmit(formik.values)}/>
      </div>
    </div>
};

const mapWordsToWordsAndMorphologyListMetadata = (it: Word, wordIndex: number): WordsAndMorphologyListMetadata => ({wordIndex, wordsAndMorphologies: it.wordsAndMorphologies});


const createEmptyWord = (): Word => ({
  definitions: [createDefinition()],
  wordsAndMorphologies: [{
    morphologyCategory: '',
    morphologyEndings: '',
    word: '',
    falseParallel: false
  }]
})

const createDefinition = (): WordDefinition => ({
  equivalentDefinitions: [],
  equalMeaning: false,
  example: '',
  definition: ''
})

export default withFormik<Props, WordArticle>({
  mapPropsToValues: props => props.article,
  validationSchema: schema,
  handleSubmit: (values, formikBag) => {}
})(ArticleForm)