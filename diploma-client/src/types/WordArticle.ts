import {Word} from "./Word";

export type WordArticle = {
  id?: any
  firstLanguageWords: Word[]
  otherLanguageWords: Word[]
}