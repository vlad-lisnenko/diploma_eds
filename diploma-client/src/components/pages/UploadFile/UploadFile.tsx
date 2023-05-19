import React, {FC, useState} from 'react';
import {Button} from "../../controls/Button";
import {UploadFileButton} from "../../UploadFileButton/UploadFileButton";
import {uploadFile} from "../../../redux/actions/fileActions";
import {useDispatch, useSelector} from "react-redux";
import {showMessageWithTimeout} from "../../../redux/actions/notificationActions";
import {State} from "../../../redux/reducers/reducers";

export const UploadFile: FC = () => {
  const [file, setFile] = useState<File>()
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const dispatch = useDispatch()
  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage)
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)

  return !firstLanguage || !secondLanguage ? null : (
    <div className="common__flex-center" style={{paddingTop: '10rem'}}>
      <div>
        <p>{file ? `Selected file: ${file.name}` : "No file selected"}</p>
        <div className="common__padding-top-bottom-10px">
          <div className="common__flex common__flex-justify-content-flex-end">
            <UploadFileButton value="Select file"
                              component="label"
                              onClick={setFile}/>
            <div className="common__padding-right-left-10px">
              <Button value="Upload file" disabled={buttonDisabled} onClick={ async () => {
                if (file) {
                  try {
                    setButtonDisabled(true)
                    await dispatch(uploadFile(file, firstLanguage.language.toLowerCase(), secondLanguage.language.toLowerCase()))
                    setButtonDisabled(false)
                    dispatch(showMessageWithTimeout(`File ${file.name} successfully uploaded`))
                  } catch (e) {
                    setButtonDisabled(false)
                    dispatch(showMessageWithTimeout(`Failed to upload "${file.name}"`))
                  }
                }
              } }/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};