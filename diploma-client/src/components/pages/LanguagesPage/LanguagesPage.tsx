import React, {Dispatch, FC} from 'react';
import {LanguageForm} from "../../LanguageForm/LanguageForm";
import {Language} from "../../../types/Language";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../../redux/reducers/reducers";
import {mapFormLanguageToLanguage, mapLanguageToLanguageFromData} from "../../../service/languageService";
import {deleteLanguage, updateLanguage} from "../../../redux/actions/languageActions";
import {showMessageWithTimeout} from "../../../redux/actions/notificationActions";
import {handleRequestError} from "../../../utils/errorHandlingUtils";

export const LanguagesPage: FC = () => {
  const languages = useSelector((state: State) => state.languages.all)
  const dispatch = useDispatch()

  return !languages ? null : languages.length < 1 ? <NoLanguages/> : (
    <div id="page-container">
      {languages.map((it, index) => mapLanguageToLanguageForm(it, dispatch, index))}
    </div>
  );
};

const NoLanguages: FC = () => (
  <div className="common__flex-center">
    <div style={{fontSize: '30pt'}}>No languages found</div>
  </div>
)

const mapLanguageToLanguageForm = (language: Language, dispatch: Dispatch<any>, index: number) => {
  return (
    <div className="common__padding-1em common__flex-center">
      <LanguageForm showDeleteButton
                    showDialog={false}
                    key={language.id}
                    saveButtonText="Update"
                    languageId={language.id}
                    onSubmit={async languageFormData => {
                      return dispatch(updateLanguage(mapFormLanguageToLanguage(languageFormData, language.id), language.id))
                    }} language={mapLanguageToLanguageFromData(language)}
                    onDelete={async id => {
                      try {
                        await dispatch(deleteLanguage(id, language))
                        dispatch(showMessageWithTimeout('WordLanguage successfully deleted'))
                      } catch (e) {
                        handleRequestError(dispatch, e)
                      }
                    }}/>
    </div>
  )
}