import {ActionTypes} from "../store/store";

export enum DialogActions {
  SHOW_DIALOG = 'SHOW_DIALOG',
  HIDE_DIALOG = 'HIDE_DIALOG',
  DIALOG_RESULT_YES = 'DIALOG_RESULT_YES',
  DIALOG_RESULT_NO = 'DIALOG_RESULT_NO',
  CLEAR_RESULT = 'CLEAR_RESULT'
}

export type DialogActionsType = ActionTypes<typeof dialogActions>

export const dialogActions = {
  showDialog: () => ({
    type: DialogActions.SHOW_DIALOG
  } as const),

  hideDialog: () => ({
    type: DialogActions.HIDE_DIALOG
  } as const),

  dialogResultYes: () => ({
    type: DialogActions.DIALOG_RESULT_YES
  } as const),

  dialogResultNo: () => ({
    type: DialogActions.DIALOG_RESULT_NO
  } as const),

  clearResult: () => ({
    type: DialogActions.CLEAR_RESULT
  } as const)
}