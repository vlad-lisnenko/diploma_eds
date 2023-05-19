import {ArticleFormActions, ArticleFormActionTypes} from "../actions/articleFormActions";
import {WordAndMorphology} from "../../types/WordAndMorphology";

export type ActiveWord = {
  wordIndex: number
  wordAndMorphologyIndex: number
}

export type WordsAndMorphologyListMetadata = {
  wordIndex?: number
  wordsAndMorphologies: WordAndMorphology[]
}

type ArticleFormState = {
  firstLanguageWords: WordsAndMorphologyListMetadata[]
  secondLanguageWords: WordsAndMorphologyListMetadata[]
  activeSecondWord: ActiveWord
  activeFirstWord: ActiveWord
}

const initialState: ArticleFormState = {
  firstLanguageWords: [{wordsAndMorphologies: []}],
  secondLanguageWords: [{wordsAndMorphologies: []}],
  activeSecondWord: {wordIndex: 0, wordAndMorphologyIndex: 0},
  activeFirstWord: {wordIndex: 0, wordAndMorphologyIndex: 0}
}

export const articleForm = (state = initialState, action: ArticleFormActionTypes): ArticleFormState => {
  switch (action.type) {
    case ArticleFormActions.SET_FIRST_LANGUAGE_WORDS:
      return {
        ...state,
        firstLanguageWords: action.words
      }
    case ArticleFormActions.SET_SECOND_LANGUAGE_WORDS:
      return {
        ...state,
        secondLanguageWords: action.words
      }
    case ArticleFormActions.SET_ACTIVE_FIRST_WORD:
      return {
        ...state,
        activeFirstWord: action.activeWord
      }
    case ArticleFormActions.SET_ACTIVE_SECOND_WORD:
      return {
        ...state,
        activeSecondWord: action.activeWord
      }
    case ArticleFormActions.SET_SECOND_LANGUAGE_SINGLE_WORD:
      if (state.secondLanguageWords.length < 1) {
        return state
      }
      state.secondLanguageWords[action.index].wordsAndMorphologies[action.wordAndMorphologyIndex] = action.word
      return {
        ...state,
        secondLanguageWords: [...state.secondLanguageWords]
      }
    case ArticleFormActions.SET_FIRST_LANGUAGE_SINGLE_WORD:
      if (state.firstLanguageWords.length < 1) {
        return state
      }
      state.firstLanguageWords[action.index].wordsAndMorphologies[action.wordAndMorphologyIndex] = action.word
      return {
        ...state,
        firstLanguageWords: [...state.firstLanguageWords]
      }
    case ArticleFormActions.REMOVE_WORD:
      return {
        ...state,
        secondLanguageWords: state.secondLanguageWords.filter((it, index) => index !== action.index)
      }
    case ArticleFormActions.CLEAR_SECOND_WORDS:
      return {
        ...state,
        secondLanguageWords: [{wordsAndMorphologies: []}],
        activeSecondWord: {wordIndex: 0, wordAndMorphologyIndex: 0}
      }
    default:
      return state
  }
}