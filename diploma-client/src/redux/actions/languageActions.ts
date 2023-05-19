import {ActionTypes} from "../store/store";
import {ThunkAction} from "redux-thunk";
import {State} from "../reducers/reducers";
import {Language} from "../../types/Language";
import {Api} from "../../api/api";
import {ThunkResult} from "../../types/ThunkResult";
import {showMessageWithTimeout} from "./notificationActions";
import {dictionaryActions} from "./dictionaryActions";
import {handleRequestError} from "../../utils/errorHandlingUtils";
import {
  firstLanguageLocalStorageKey,
  secondLanguageLocalStorageKey
} from "../../components/CurrentDictionary/CurrentDictionary";

export enum LanguageActions {
  SET_LANGUAGES = 'SET_LANGUAGES',
  UPDATE_LANGUAGE = 'UPDATE_LANGUAGE',
  DELETE_LANGUAGE = 'DELETE_LANGUAGE'
}

export type LanguageTypes = ActionTypes<typeof languagesActions>

export const languagesActions = {
  setLanguages: (languages: Language[]) => ({
    type: LanguageActions.SET_LANGUAGES,
    languages
  } as const),

  updateLanguage: (language: Language) => ({
    type: LanguageActions.UPDATE_LANGUAGE,
    language
  } as const),

  deleteLanguage: (id: any) => ({
    type: LanguageActions.DELETE_LANGUAGE,
    id
  } as const)
}

export const fetchLanguages = (): ThunkAction<Promise<void>, State, never, any> => async dispatch => {
  const languages = (await Api.get('/languages')).data
  dispatch(languagesActions.setLanguages(languages))
};

export const updateLanguage = (language: Language, id: any):ThunkResult => async dispatch => {
  const path = `/languages/${id}`
  try {
    const updatedLanguage = (await Api.put(path, language)).data
    dispatch(languagesActions.updateLanguage(updatedLanguage))
    dispatch(dictionaryActions.updateIfSelected(updatedLanguage))
    dispatch(showMessageWithTimeout('WordLanguage successfully updated'))
    return updatedLanguage
  } catch (e) {
    handleRequestError(dispatch, e)
    throw e
  }
}

export const deleteLanguage = (id: any, language: Language):ThunkResult => async dispatch => {
  const path = `/languages/${id}`
  await Api.delete(path)

  const firstLanguage = localStorage.getItem(firstLanguageLocalStorageKey);
  if (firstLanguage === language.language.toLowerCase()) {
    localStorage.removeItem(firstLanguageLocalStorageKey)
  } else {
    const secondLanguage = localStorage.getItem(secondLanguageLocalStorageKey)
    if (secondLanguage === language.language.toLowerCase()) {
      localStorage.removeItem(secondLanguageLocalStorageKey)
    }
  }

  dispatch(languagesActions.deleteLanguage(id));
  dispatch(dictionaryActions.changeIfDeleted(id))
}