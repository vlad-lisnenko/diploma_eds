import {ActionTypes} from "../store/store";
import {ThunkAction} from "redux-thunk";
import {State} from "../reducers/reducers";
import {ArticleWithNearWords} from "../reducers/words";
import {Api} from "../../api/api";

export type WordActions = ActionTypes<typeof wordActions>

export enum WordActionTypes {
  SET_WORD_ARTICLE = 'SET_WORD_ARTICLE',
  CLEAR_WORD_ARTICLE = 'CLEAR_WORD_ARTICLE',
  REMOVE_ONLY_ARTICLE = 'REMOVE_ONLY_ARTICLE'
}

export const wordActions = {
  setWordArticle: (wordArticle: ArticleWithNearWords) => ({
    type: WordActionTypes.SET_WORD_ARTICLE,
    wordArticle
  } as const),

  removeOnlyArticle: () => ({
    type: WordActionTypes.REMOVE_ONLY_ARTICLE
  } as const),

  clearWordArticle: () => ({
    type: WordActionTypes.CLEAR_WORD_ARTICLE
  } as const)
}

export const fetchWordArticleWithClearWords = (firstLanguage: string, secondLanguage: string, articleId: string): ThunkAction<Promise<void>, State, unknown, any> => async dispatch => {
  const path = `/${firstLanguage}/${secondLanguage}/${articleId}/with-close-words`

  const articleWithNearWords = (await Api.get(path)).data

  dispatch(wordActions.setWordArticle(articleWithNearWords))
}