import {ActionTypes} from "../store/store";
import {WordArticle} from "../../types/WordArticle";
import {Language} from "../../types/Language";
import {Api} from "../../api/api";
import {AxiosResponse} from "axios";
import {ThunkResult} from "../../types/ThunkResult";
import {WordArticleSearchResponse} from "../../types/WordArticleSearchResponse";

export enum ArticleActions {
  SET_ARTICLES = 'SET_ARTICLES',
  SET_ARTICLE_BY_ID = 'SET_ARTICLE_BY_ID',
  REMOVE_ARTICLE_FROM_LIST = 'REMOVE_ARTICLE_FROM_LIST',
  CLEAR_ARTICLES = 'CLEAR_ARTICLES',
  CLEAR_SINGLE_ARTICLE = 'CLEAR_SINGLE_ARTICLE',
}

export type ArticleTypes = ActionTypes<typeof articleActions>

export const articleActions = {
  setArticles: (articles: WordArticleSearchResponse) => ({
    type: ArticleActions.SET_ARTICLES,
    articles
  } as const),

  setArticleById: (article: WordArticle) => ({
    type: ArticleActions.SET_ARTICLE_BY_ID,
    article
  } as const),

  removeArticleFromList: (id: any) => ({
    type: ArticleActions.REMOVE_ARTICLE_FROM_LIST,
    id
  } as const),

  clearArticles: () => ({
    type: ArticleActions.CLEAR_ARTICLES
  } as const),

  clearSingleArticle: () => ({
    type: ArticleActions.CLEAR_SINGLE_ARTICLE
  } as const),
}

export const fetchArticlesForLetter = (letter: string, firstLanguage: string, secondLanguage: string,
                                       pageNumber: number, pageSize: number, isSecondLanguage?: boolean): ThunkResult => async dispatch => {
  const path = `/${firstLanguage.toLowerCase()}/${secondLanguage.toLowerCase()}/prefix/${letter}`
  const data = await Api.get(path, {pageNumber: pageNumber - 1, pageSize, isSecondLanguage})

  const articles = data.data
  dispatch(articleActions.setArticles(articles))
}

export const fetchArticleByWord = (word: string, firstLanguage: string, secondLanguage: string, pageNumber: number, pageSize: number): ThunkResult => async dispatch => {
  const path = `/${firstLanguage.toLowerCase()}/${secondLanguage.toLowerCase()}/search/${word}`
  const data = await Api.get(path, {pageNumber: pageNumber - 1, pageSize})
  const articles = data.data
  dispatch(articleActions.setArticles(articles))
}

export const fetchArticleByID = (id: any, firstLanguage: string, secondLanguage: string): ThunkResult => async dispatch => {
  const path = `/${firstLanguage.toLowerCase()}/${secondLanguage.toLowerCase()}/${id}`
  const data = await Api.get(path)
  const article = data.data

  dispatch(articleActions.setArticleById(article))
}

export const saveNewArticle = async (article: WordArticle, firstLanguage: Language, secondLanguage: Language): Promise<AxiosResponse> => {
  const path = `/${firstLanguage.language.toLowerCase()}/${secondLanguage.language.toLowerCase()}`
  return Api.post(path, article)
}

export const updateArticle = async (article: WordArticle, firstLanguage: string, secondLanguage: string): Promise<AxiosResponse> => {
  const path = `/${firstLanguage.toLowerCase()}/${secondLanguage.toLowerCase()}/${article.id}`
  return Api.put(path, article)
}

export const deleteArticle = async (id: any, firstLanguage: string, secondLanguage: string): Promise<AxiosResponse> => {
  const path = `/${firstLanguage.toLowerCase()}/${secondLanguage.toLowerCase()}/${id}`
  return Api.delete(path)
}
