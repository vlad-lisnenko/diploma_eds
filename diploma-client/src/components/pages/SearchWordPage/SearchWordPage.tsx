import React, {FC, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {State} from '../../../redux/reducers/reducers';
import {Button} from "../../controls/Button";
import {AsyncAutocompleteInput} from '../../inputs/AsyncAutocompleteInput/AsyncAutocompleteInput';
import './SearchWordPage.scss'
import {pathCreators} from "../../../constants/Pages";

export const SearchWordPage: FC = () => {
  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage)
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)

  const [searchValue, setSearchValue] = useState('');

  return !firstLanguage || !secondLanguage ? null : (
    <div className="search-word common__flex-stretch" >
      <div className="search-word__search-controls">
        <div>
          <AsyncAutocompleteInput value={searchValue} onChange={setSearchValue}/>
        </div>
        <div className="search-word__search-controls__buttons">
          <Link to={pathCreators.searchByWord(
            firstLanguage.language.toLowerCase(),
            secondLanguage.language.toLowerCase(),
            searchValue,
            1
          )}>
            <Button value="Search" />
          </Link>
        </div>
      </div>
    </div>
  );
};