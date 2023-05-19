import {Language} from "../types/Language";
import {Api} from "../api/api";
import {LanguageFormData} from "../components/LanguageForm/LanguageForm";

export const saveLanguage = async (language: Language) => {
  const path = '/languages'
  return (await Api.post(path, language)).data
}

export const mapFormLanguageToLanguage = (language: LanguageFormData, id?: any): Language => {
  const alphabet = language.alphabet.split(',').map(it => it.trim().toUpperCase());
  return {
    id,
    language: language.language,
    alphabet
  }
}

export const mapLanguageToLanguageFromData = (language: Language): LanguageFormData => {
  return {language: language.language, alphabet: language.alphabet.reduce((previousValue, currentValue) => `${previousValue}, ${currentValue}`)}
}