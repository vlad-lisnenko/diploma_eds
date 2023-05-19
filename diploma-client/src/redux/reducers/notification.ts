import {NotificationActions, NotificationTypes} from "../actions/notificationActions";

type NotificationState = {
  message: string
  visible: boolean
}

const initialState: NotificationState = {
  message: '',
  visible: false
}

export const notification = (state = initialState, action: NotificationTypes) => {
  switch (action.type) {
    case NotificationActions.SHOW_MESSAGE:
      return {
        ...state,
        message: action.message,
        visible: true
      }

    case NotificationActions.HIDE_MESSAGE:
      return {
        ...state,
        visible: false
      }

    default:
      return state
  }
}