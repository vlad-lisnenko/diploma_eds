import React, {FC, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {articleActions, fetchArticleByWord} from "../../redux/actions/articleActions";
import {useParams} from "react-router-dom";
import {State} from "../../redux/reducers/reducers";
import {getLanguagesByString} from "../../utils/languageUtils";
import {dictionaryActions} from "../../redux/actions/dictionaryActions";
import {pathCreators} from "../../constants/Pages";
import {useQuery} from "../../utils/useQuery";
import {PageableArticlesSearchResult} from "../ArticlesSearchResult/PageableArticlesSearchResult";

type PageParams = {
  word: string
  firstLanguage: string
  secondLanguage: string
  pageNumber: string
}

export const SearchArticlesPage: FC = () => {
  const dispatch = useDispatch()
  const query = useQuery();
  const params = useParams<PageParams>()
  const articles = useSelector((state: State) => state.articles.articles)
  const languages = useSelector((state: State) => state.languages.all)
  const [firstLanguageFromState, secondLanguageFromState] = languages ? getLanguagesByString(params.firstLanguage, params.secondLanguage, languages) : []
  const pageSize = Number(query.get("pageSize")) || 20
  const pageNumber = Number(params.pageNumber)

  useEffect(() => {
    if (firstLanguageFromState && secondLanguageFromState) {
      dispatch(dictionaryActions.setFirstLanguage(firstLanguageFromState))
      dispatch(dictionaryActions.setSecondLanguage(secondLanguageFromState))
    }
  }, [firstLanguageFromState, secondLanguageFromState])

  useEffect(() => {
    if (params.firstLanguage && params.secondLanguage && pageNumber) {
      dispatch(fetchArticleByWord(params.word, params.firstLanguage, params.secondLanguage, pageNumber, pageSize))
    }

    return () => {
      dispatch(articleActions.clearArticles())
    };
  }, [params.firstLanguage, params.secondLanguage, pageSize, pageNumber])

  return !articles || !firstLanguageFromState || !secondLanguageFromState ? null : (
    <PageableArticlesSearchResult searchResponse={articles}
                                  firstLanguage={firstLanguageFromState}
                                  secondLanguage={secondLanguageFromState}
                                  pageNumber={pageNumber}
                                  pageSize={pageSize}
                                  linkCreator={(newPageNumber, newPageSize) => pathCreators.searchByWord(
                                    firstLanguageFromState.language.toLowerCase(),
                                    secondLanguageFromState.language.toLowerCase(),
                                    params.word,
                                    newPageNumber,
                                    newPageSize
                                  )}/>
  );
};