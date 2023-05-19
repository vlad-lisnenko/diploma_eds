import {WordArticle} from "../types/WordArticle";
import {WordDefinition} from "../types/WordDefinition";
import {Word} from "../types/Word";
import {Api} from "../api/api";

export const processArticle = (article: WordArticle) => {
  article.firstLanguageWords.forEach(processWord)
  article.otherLanguageWords.forEach(processWord)
}

const processWord = (word: Word) => {
  word.definitions.forEach(processDefinition)

  if (word.definitions.length > 1) {
    word.definitions = word.definitions.filter(it => it.definition)
  }
}

const processDefinition = (definition: WordDefinition) => {
  definition.equivalentDefinitions = (definition.equivalentDefinitions || []).filter(it => it.definition)
}

export const isUniqueWord = async (firstLanguage: string, secondLanguage: string, word: string): Promise<boolean> => {
  const path = `/${firstLanguage.toLowerCase()}/${secondLanguage.toLowerCase()}/unique/${word}`
  try {
    await Api.get(path)
    return false
  } catch (e) {
    if (e.response.status === 404) {
      return true
    } else {
      throw e
    }
  }
}