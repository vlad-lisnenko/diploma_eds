import {DictionaryActions, DictionaryTypes} from "../actions/dictionaryActions";
import {Language} from "../../types/Language";

const initialState: DictionaryState = {
  firstLanguage: undefined,
  secondLanguage: undefined
}

type DictionaryState = {
  firstLanguage?: Language
  secondLanguage?: Language
}

export const dictionaryDetails = (state = initialState, action: DictionaryTypes): DictionaryState => {
  switch (action.type) {
    case DictionaryActions.SET_FIRST_LANGUAGE:
      return {
        ...state, firstLanguage: action.language
      }
    case DictionaryActions.SET_SECOND_LANGUAGE:
      return {
        ...state, secondLanguage: action.language
      }
    case DictionaryActions.FLIP_LANGUAGES:
      const firstLanguage = state.firstLanguage
      return {
        ...state, firstLanguage: state.secondLanguage, secondLanguage: firstLanguage
      }
    case DictionaryActions.UPDATE_IF_SELECTED:
      return {
        ...state,
        firstLanguage: state.firstLanguage?.id === action.language.id ? action.language : state.firstLanguage,
        secondLanguage: state.secondLanguage?.id === action.language.id ? action.language : state.secondLanguage
      }
    case DictionaryActions.DELETE_IF_NEEDED:
      return {
        ...state,
        firstLanguage: state.firstLanguage?.id === action.id ? undefined : state.firstLanguage,
        secondLanguage: state.secondLanguage?.id === action.id ? undefined : state.secondLanguage
      }
    default:
      return state
  }
}