import {ThunkAction} from "redux-thunk";
import {State} from "../redux/reducers/reducers";

export type ThunkResult = ThunkAction<Promise<void>, State, never, any>