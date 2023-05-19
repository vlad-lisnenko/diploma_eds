import React, {FC} from 'react';
import {useSelector} from "react-redux";
import {Link} from 'react-router-dom';
import {State} from "../../redux/reducers/reducers";
import "./LanguagesAlphabets.scss"
import {pathCreators} from "../../constants/Pages";

export const LanguagesAlphabets: FC = () => {
  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage)
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)

  return !(firstLanguage && secondLanguage) ? null : (
    <div>
      <div className="common__flex-center common__padding-top-bottom-10px">
        {firstLanguage?.alphabet?.map((it, index) =>
          <span key={index} className="language-alphabets__letter">
            <Link to={pathCreators.searchByLetter(
              firstLanguage.language.toLowerCase(),
              secondLanguage.language.toLowerCase(),
              it,
              1
            )}>
              {it}
            </Link>
          </span>)}
      </div>
      <div className="common__flex-center common__padding-top-bottom-10px">
        {secondLanguage?.alphabet?.map((it, index) =>
          <span key={index} className="language-alphabets__letter">
            <Link to={pathCreators.searchByLetter(
              firstLanguage.language.toLowerCase(),
              secondLanguage.language.toLowerCase(),
              it,
              1,
              undefined,
              true
            )}>
              {it}
            </Link>
          </span>)}
      </div>
    </div>
  );
};