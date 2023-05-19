import {ActionTypes} from "../store/store";
import {ActiveWord, WordsAndMorphologyListMetadata} from "../reducers/articleForm";
import {WordAndMorphology} from "../../types/WordAndMorphology";

export enum ArticleFormActions {
  SET_FIRST_LANGUAGE_WORDS = 'SET_FIRST_LANGUAGE_WORDS',
  SET_SECOND_LANGUAGE_WORDS = 'SET_SECOND_LANGUAGE_WORDS',
  SET_SECOND_LANGUAGE_SINGLE_WORD = 'SET_SECOND_LANGUAGE_SINGLE_WORD',
  SET_FIRST_LANGUAGE_SINGLE_WORD = 'SET_FIRST_LANGUAGE_SINGLE_WORD',
  SET_ACTIVE_SECOND_WORD = 'SET_ACTIVE_SECOND_WORD',
  SET_ACTIVE_FIRST_WORD = 'SET_ACTIVE_FIRST_WORD',
  REMOVE_WORD = 'REMOVE_WORD',
  CLEAR_SECOND_WORDS = 'CLEAR_SECOND_WORDS'
}

export const articleFormActions = {
  setFirstLanguageWords: (words: WordsAndMorphologyListMetadata[]) => ({
    type: ArticleFormActions.SET_FIRST_LANGUAGE_WORDS,
    words
  } as const),

  setSecondLanguageWords: (words: WordsAndMorphologyListMetadata[]) => ({
    type: ArticleFormActions.SET_SECOND_LANGUAGE_WORDS,
    words
  } as const),

  setActiveSecondWord: (activeWord: ActiveWord) => ({
    type: ArticleFormActions.SET_ACTIVE_SECOND_WORD,
    activeWord
  } as const),

  setActiveFirstWord: (activeWord: ActiveWord) => ({
    type: ArticleFormActions.SET_ACTIVE_FIRST_WORD,
    activeWord
  } as const),

  setSecondLanguageWord: (index: number, word: WordAndMorphology, wordAndMorphologyIndex: number) => ({
    type: ArticleFormActions.SET_SECOND_LANGUAGE_SINGLE_WORD,
    index, word,
    wordAndMorphologyIndex
  } as const),

  setFirstLanguageWord: (index: number, word: WordAndMorphology, wordAndMorphologyIndex: number) => ({
    type: ArticleFormActions.SET_FIRST_LANGUAGE_SINGLE_WORD,
    index, word,
    wordAndMorphologyIndex
  } as const),

  removeWord: (index: number) => ({
    type: ArticleFormActions.REMOVE_WORD,
    index
  } as const),

  clearSecondWords: () => ({
    type: ArticleFormActions.CLEAR_SECOND_WORDS
  } as const)
}

export type ArticleFormActionTypes = ActionTypes<typeof articleFormActions>