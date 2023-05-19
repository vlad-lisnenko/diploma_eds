import React, {FC} from 'react';
import {LanguageForm} from "../../LanguageForm/LanguageForm";
import {mapFormLanguageToLanguage, saveLanguage} from "../../../service/languageService";
import {useDispatch} from "react-redux";
import {showMessageWithTimeout} from "../../../redux/actions/notificationActions";
import {fetchLanguages} from "../../../redux/actions/languageActions";
import {handleRequestError} from "../../../utils/errorHandlingUtils";

export const LanguageCreatePage: FC = () => {
  const dispatch = useDispatch()
  return (
    <div id="page-container" className="common__flex-center common__padding-1em">
      <LanguageForm showDialog={true} saveButtonText="Save" onSubmit={async language => {
        try {
          dispatch(showMessageWithTimeout('WordLanguage successfully saved'));
          const savedArticle = await saveLanguage(mapFormLanguageToLanguage(language));
          dispatch(fetchLanguages())
          return savedArticle;
        } catch (e) {
          handleRequestError(dispatch, e)
          throw e
        }
      }} language={{language: '', alphabet: ''}} />
    </div>
  );
};