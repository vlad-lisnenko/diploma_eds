import {WordArticle} from "../../types/WordArticle";
import {ArticleActions, ArticleTypes} from "../actions/articleActions";
import {WordArticleSearchResponse} from "../../types/WordArticleSearchResponse";

type ArticleState = {
  articles?: WordArticleSearchResponse
  articleById?: WordArticle
}

const initialState: ArticleState = {

}

export const articles = (state = initialState, action: ArticleTypes): ArticleState => {
  switch (action.type) {
    case ArticleActions.SET_ARTICLES:
      return {
        ...state,
        articles: action.articles
      }
    case ArticleActions.SET_ARTICLE_BY_ID:
      return {
        ...state,
        articleById: action.article
      }
    case ArticleActions.REMOVE_ARTICLE_FROM_LIST:
      return {
        ...state,
        articles: {totalCount: state.articles?.totalCount || 0, wordArticles: (state.articles?.wordArticles || []).filter(it => it.id !== action.id)}
      }
    case ArticleActions.CLEAR_ARTICLES:
      return {
        ...state,
        articles: undefined
      }
    case ArticleActions.CLEAR_SINGLE_ARTICLE:
      return {
        ...state,
        articleById: undefined
      }
    default:
      return state
  }
}