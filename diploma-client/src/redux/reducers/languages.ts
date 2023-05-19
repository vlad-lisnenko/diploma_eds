import {LanguageActions, LanguageTypes} from "../actions/languageActions";
import {Language} from "../../types/Language";

type LanguageState = {
  all?: Language[]
}

const initialState: LanguageState = {

}

export const languages = (state = initialState, action: LanguageTypes) => {
  switch (action.type) {
    case LanguageActions.SET_LANGUAGES:
      return {
          ...state,
          all: action.languages
      }
    case LanguageActions.UPDATE_LANGUAGE:
      return {
        ...state,
        all: state.all?.map(it => {
          console.log(`${it.id} ${it.language} - ${action.language.id} ${action.language.language}`)
          return it.id === action.language.id ? action.language : it
        })
      }
    case LanguageActions.DELETE_LANGUAGE:
      return {
        ...state,
        all: state.all?.filter(it => it.id !== action.id)
      }
    default:
      return state
  }
}