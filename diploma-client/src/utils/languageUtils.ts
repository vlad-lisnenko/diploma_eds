import {Language} from "../types/Language";

export const getLanguagesByString = (firstLanguage: string, secondLanguage: string, languages: Language[]): [Language | undefined, Language | undefined] => {
  const first = languages.find(it => it.language.toLowerCase() === firstLanguage.toLowerCase())
  const second = languages.find(it => it.language.toLowerCase() === secondLanguage.toLowerCase())
  return [first, second]
}

export const getLanguageByString = (language: string, languages: Language[]): Language | undefined => {
  return languages.find(it => it.language.toLowerCase() === language.toLowerCase())
}