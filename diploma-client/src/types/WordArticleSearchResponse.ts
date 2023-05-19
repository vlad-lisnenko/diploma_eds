import {WordArticle} from "./WordArticle";

export type WordArticleSearchResponse = {
  wordArticles: WordArticle[];
  totalCount: number;
}