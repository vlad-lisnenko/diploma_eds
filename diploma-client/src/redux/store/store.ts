import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";
import {reducers} from "../reducers/reducers";

// @ts-ignore
const composedEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

type ActionCreatorReturnType<T> = T extends {[key: string]: infer U} ? U : never
export type ActionTypes<T extends {[key: string]: (...args: any[]) => any}> = ReturnType<ActionCreatorReturnType<T>>

export const store = createStore(
  reducers,
  composedEnhancers(applyMiddleware(thunk))
)