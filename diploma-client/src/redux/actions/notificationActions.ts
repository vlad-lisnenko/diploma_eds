import {ActionTypes} from "../store/store";
import {ThunkResult} from "../../types/ThunkResult";

export enum NotificationActions {
  SHOW_MESSAGE = 'SHOW_MESSAGE',
  HIDE_MESSAGE = 'HIDE_MESSAGE'
}

export type NotificationTypes = ActionTypes<typeof notificationActions>

export const notificationActions = {
  showMessage: (message: string) => ({
    type: NotificationActions.SHOW_MESSAGE,
    message
  } as const),

  hideMessage: () => ({
    type: NotificationActions.HIDE_MESSAGE
  } as const)
}


export const showMessageWithTimeout = (message: string, timeout = 3000): ThunkResult => async dispatch => {
  dispatch(notificationActions.showMessage(message))
  setTimeout(() => dispatch(notificationActions.hideMessage()), timeout)
}