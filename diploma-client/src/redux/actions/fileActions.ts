import {ThunkResult} from "../../types/ThunkResult";
import {Api} from "../../api/api";

export const uploadFile = (file: File, firstLanguage: string, secondLanguage: string): ThunkResult => async dispatch => {
  const path = `/pdf/${firstLanguage}/${secondLanguage}/`

  const formData = new FormData()
  formData.append("file", file, file.name)
  const response = await Api.post(path, formData)
}