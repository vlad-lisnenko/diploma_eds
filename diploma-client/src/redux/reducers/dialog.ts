import {DialogActions, DialogActionsType} from "../actions/dialogActions";

type DialogState = {
  dialogVisible: boolean,
  dialogOkResult?: boolean
}

const initialState: DialogState = {
  dialogVisible: false
}

export const dialog = (state = initialState, action: DialogActionsType): DialogState => {
  switch (action.type) {
    case DialogActions.SHOW_DIALOG:
      return {
        ...state,
        dialogVisible: true
      }

    case DialogActions.HIDE_DIALOG:
      return {
        ...state,
        dialogVisible: false
      }

    case DialogActions.DIALOG_RESULT_YES:
      return {
        ...state,
        dialogOkResult: true
      }

    case DialogActions.DIALOG_RESULT_NO:
      return {
        ...state,
        dialogOkResult: false
      }

    case DialogActions.CLEAR_RESULT:
      return {
        ...state,
        dialogOkResult: undefined
      }

    default:
      return state
  }
}