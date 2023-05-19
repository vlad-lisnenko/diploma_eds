import {Dispatch} from "react";
import {showMessageWithTimeout} from "../redux/actions/notificationActions";

export const handleRequestError = (dispatch: Dispatch<any>, error: any) => {
  console.log(JSON.stringify(error.response, null, 2))
  if (error.response.status >= 400 && error.response.status < 500 && error?.response?.data?.message) {
    console.log(`dispatching error message: ${error.response.data.message}`)
    dispatch(showMessageWithTimeout(error.response.data.message))
  } else {
    dispatch(showMessageWithTimeout('Something went wrong'))
  }
}