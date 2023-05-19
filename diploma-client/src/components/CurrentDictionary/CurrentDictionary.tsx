import React, {Dispatch, FC, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../redux/reducers/reducers";
import {dictionaryActions} from "../../redux/actions/dictionaryActions";
import './CurrentDictionary.scss'
import {fetchLanguages} from '../../redux/actions/languageActions';
import {DropDown} from "../controls/DropDown";
import {getLanguagesByString} from "../../utils/languageUtils";
import {Language} from "../../types/Language";

export const firstLanguageLocalStorageKey = 'firstLanguage'
export const secondLanguageLocalStorageKey = 'secondLanguage'

export const CurrentDictionary: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLanguages())
  }, [])

  const languages = useSelector((state: State) => state.languages.all)

  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage);
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)
  
  if (languages?.length === 0 || !languages) {
    return null
  }

  const firstLanguageFromStorage = localStorage.getItem(firstLanguageLocalStorageKey);
  const secondLanguageFromStorage = localStorage.getItem(secondLanguageLocalStorageKey);

  const [first, second] = getLanguagesByString(firstLanguageFromStorage || '', secondLanguageFromStorage || '', languages)

  if (first && second) {
    dispatch(dictionaryActions.setFirstLanguage(first))
    dispatch(dictionaryActions.setSecondLanguage(second))
  } else {
    if (!firstLanguage) {
      // dispatch(dictionaryActions.setFirstLanguage(languages[0]));
      const first = (languages.filter(it => it.id !== secondLanguage?.id))[0];
      setFirstLanguage(dispatch, first)
    }

    if (!secondLanguage && firstLanguage) {
      // dispatch(dictionaryActions.setSecondLanguage(languages[1]))
      const second = (languages.filter(it => it.id !== firstLanguage?.id))[0];
      setSecondLanguage(dispatch, second)
    }
  }

  const dropdownArguments = languages.map(it => ({id: it.id, value: it, displayValue: it.language}))

  return !firstLanguage || !secondLanguage ? null : (
    <div>
      <div className="current-dictionary">
        <div>
          Dictionary:
        </div>
        <div className="current-dictionary__language-dropdown">
          <DropDown value={firstLanguage.id}
                    values={dropdownArguments.filter(it => it.id !== secondLanguage.id)}
                    handleChange={e => setFirstLanguage(dispatch, e.value)}/>
        </div>

        <span className="flip-button" onClick={() => flipLanguages(dispatch)}>
          <img className="flip-button__image" src="/assets/change-language.svg" alt="change language"/>
        </span>

        <div className="current-dictionary__language-dropdown">
          <DropDown value={secondLanguage.id}
                    values={dropdownArguments.filter(it => it.id !== firstLanguage.id)}
                    handleChange={e => setSecondLanguage(dispatch, e.value)} />
        </div>
      </div>
    </div>
  );
};

const setFirstLanguage = (dispatch: Dispatch<any>, firstLanguage: Language) => {
  if (firstLanguage) {
    localStorage.setItem(firstLanguageLocalStorageKey, firstLanguage.language.toLowerCase())
    dispatch(dictionaryActions.setFirstLanguage(firstLanguage))
  }
}

const setSecondLanguage = (dispatch: Dispatch<any>, secondLanguage: Language) => {
  if (secondLanguage) {
    localStorage.setItem(secondLanguageLocalStorageKey, secondLanguage.language.toLowerCase())
    dispatch(dictionaryActions.setSecondLanguage(secondLanguage))
  }
}

const flipLanguages = (dispatch: Dispatch<any>) => {
  const firstLanguage = localStorage.getItem(firstLanguageLocalStorageKey)
  const secondLanguage = localStorage.getItem(secondLanguageLocalStorageKey)
  if (firstLanguage && secondLanguage) {
    localStorage.setItem(firstLanguageLocalStorageKey, secondLanguage)
    localStorage.setItem(secondLanguageLocalStorageKey, firstLanguage)
  }
  dispatch(dictionaryActions.flipLanguages())
}