import React, {FC, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {State} from '../../../redux/reducers/reducers';
import {articleActions, fetchArticlesForLetter} from "../../../redux/actions/articleActions";
import {useParams} from 'react-router-dom';
import {dictionaryActions} from "../../../redux/actions/dictionaryActions";
import {getLanguagesByString} from "../../../utils/languageUtils";
import {pathCreators} from "../../../constants/Pages";
import {useQuery} from "../../../utils/useQuery";
import {PageableArticlesSearchResult} from "../../ArticlesSearchResult/PageableArticlesSearchResult";

type Params = {
  letter: string
  firstLanguage: string
  secondLanguage: string
  pageNumber: string
}

export const LetterPageArticles: FC = () => {
  const query = useQuery();
  const dispatch = useDispatch()
  const params = useParams<Params>()
  const articlesForLetter = useSelector((state: State) => state.articles.articles)
  const languages = useSelector((state: State) => state.languages)
  const [firstLanguageFromState, secondLanguageFromState] = languages.all ? getLanguagesByString(params.firstLanguage, params.secondLanguage, languages.all) : []
  const pageSize = Number(query.get("pageSize")) || 20
  const pageNumber = Number(params.pageNumber)
  const isSecondLanguage = Boolean(query.get("isSecondLanguage"))

  useEffect(() => {
    if (firstLanguageFromState && secondLanguageFromState && pageNumber) {
      dispatch(dictionaryActions.setFirstLanguage(firstLanguageFromState))
      dispatch(dictionaryActions.setSecondLanguage(secondLanguageFromState))
      dispatch(fetchArticlesForLetter(params.letter, params.firstLanguage, params.secondLanguage, pageNumber, pageSize, isSecondLanguage));
    }

    return () => {
      dispatch(articleActions.clearArticles())
    }
  }, [params.letter, params.firstLanguage, params.secondLanguage, firstLanguageFromState, secondLanguageFromState, pageNumber, pageSize]);

  return !articlesForLetter || !firstLanguageFromState || !secondLanguageFromState ? null : (
    <PageableArticlesSearchResult searchResponse={articlesForLetter}
                                  firstLanguage={firstLanguageFromState}
                                  secondLanguage={secondLanguageFromState}
                                  pageNumber={pageNumber}
                                  pageSize={pageSize}
                                  linkCreator={(newPageNumber, newPageSize) => pathCreators.searchByLetter(
                                    firstLanguageFromState.language.toLowerCase(),
                                    secondLanguageFromState.language.toLowerCase(),
                                    params.letter,
                                    newPageNumber,
                                    newPageSize,
                                    isSecondLanguage
                                  ) } />
  );
};