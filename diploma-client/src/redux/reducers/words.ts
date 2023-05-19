import {WordArticle} from "../../types/WordArticle";
import {WordActions, WordActionTypes} from "../actions/wordActions";

type WordWithId = {
  word: string
  id: any
}

export type ArticleWithNearWords = {
  wordArticle?: WordArticle
  leftWord?: WordWithId
  rightWord?: WordWithId
}

type WordState = {
  wordArticle?: ArticleWithNearWords
}

const initialState: WordState = {}

export const words = (state = initialState, action: WordActions): WordState => {
  switch (action.type) {
    case WordActionTypes.SET_WORD_ARTICLE:
      return {
        ...state,
        wordArticle: action.wordArticle
      }
    case WordActionTypes.CLEAR_WORD_ARTICLE:
      return {
        ...state,
        wordArticle: undefined
      }
    case WordActionTypes.REMOVE_ONLY_ARTICLE:
      return {
        ...state,
        wordArticle: {...(state.wordArticle), wordArticle: undefined}
      }
    default:
      return state
  }
}