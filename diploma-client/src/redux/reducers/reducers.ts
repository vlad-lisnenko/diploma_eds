import {combineReducers} from "redux";
import {words} from "./words";
import {dictionaryDetails} from "./dictionaryDetails";
import {languages} from "./languages";
import {articles} from "./articles";
import {notification} from "./notification";
import {articleForm} from "./articleForm";
import {authState} from "./authState";
import {dialog} from "./dialog";
import {users} from "./users";

export const reducers = combineReducers({
  words,
  dictionaryDetails,
  languages,
  articles,
  notification,
  articleForm,
  authState,
  dialog,
  users
})

export type State = ReturnType<typeof reducers>