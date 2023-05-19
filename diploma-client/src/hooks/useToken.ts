import {useContext} from "react";
import {TokenContext} from "../components/provider/TokenProvider/TokenProvider";

export const useToken = () => {
  return useContext(TokenContext)
}