import {ActionTypes} from "../store/store";
import {Language} from "../../types/Language";


export enum DictionaryActions {
  SET_FIRST_LANGUAGE = 'SET_FIRST_LANGUAGE',
  SET_SECOND_LANGUAGE = 'SET_SECOND_LANGUAGE',
  FLIP_LANGUAGES = "FLIP_LANGUAGES",
  UPDATE_IF_SELECTED = 'UPDATE_IF_SELECTED',
  DELETE_IF_NEEDED = 'DELETE_IF_NEEDED'
}

export type DictionaryTypes = ActionTypes<typeof dictionaryActions>

export const dictionaryActions = {
  setFirstLanguage: (language: Language) => ({
    type: DictionaryActions.SET_FIRST_LANGUAGE,
    language
  } as const),

  setSecondLanguage: (language: Language) => ({
    type: DictionaryActions.SET_SECOND_LANGUAGE,
    language
  } as const),

  flipLanguages: () => ({
    type: DictionaryActions.FLIP_LANGUAGES
  } as const),

  updateIfSelected: (language: Language) => ({
    type: DictionaryActions.UPDATE_IF_SELECTED,
    language
  } as const),
  changeIfDeleted: (id: any) => ({
    type: DictionaryActions.DELETE_IF_NEEDED,
    id
  } as const)
}