import React, {FC, useState} from 'react';
import {NoAppropriateArticles} from "../NoAppropriateArticles";
import {ArticlesList} from "../ArticlesList/ArticlesList";
import {PaginationComponent} from "../PaginationComponent";
import {Input} from "../inputs/Input";
import {Link} from "react-router-dom";
import {Button} from "../controls/Button";
import {Language} from "../../types/Language";
import {WordArticleSearchResponse} from "../../types/WordArticleSearchResponse";

type Props = {
  searchResponse: WordArticleSearchResponse
  firstLanguage: Language
  secondLanguage: Language
  pageNumber: number
  pageSize: number
  linkCreator: (pageNumber: number, pageSize: number) => string
}

export const PageableArticlesSearchResult: FC<Props> = props => {
  return (
    props.searchResponse.wordArticles.length === 0 ?
      <NoAppropriateArticles /> : (
        <div id="letter-article-page-container" className="common__flex-align-items-center common__flex-column" style={{padding: '1em 0'}}>
          <div id="articles-list-container" style={{width: '50%'}}>
            <ArticlesPerPageComponent fistLanguage={props.firstLanguage.language.toLowerCase()}
                                      secondLanguage={props.secondLanguage.language.toLowerCase()}
                                      pageNumber={props.pageNumber}
                                      linkCreator={props.linkCreator}
                                      pageSize={props.pageSize} />
            <ArticlesList articles={props.searchResponse.wordArticles} />
          </div>
          <div id="pagination-component-container">
            <div className="common__flex-center" style={{padding: '2em 0'}}>
              <PaginationComponent totalCount={props.searchResponse.totalCount}
                                   currentPage={props.pageNumber}
                                   pageSize={props.pageSize}
                                   pageToLinkMapper={pageNumber => props.linkCreator(pageNumber, props.pageSize)} />
            </div>
          </div>
        </div>
      )
  );
};

const isValidPageSize = (pageSize: string | number, oldValue: string | number) => {
  const number = Number(pageSize)
  return number !== undefined && number > 9 && number < 101 && pageSize !== oldValue
}

type ArticlesPerPageComponentProps = {
  pageSize: number
  fistLanguage: string
  secondLanguage: string
  pageNumber: number
  linkCreator: (pageNumber: number, pageSize: number) => string
}

const ArticlesPerPageComponent: FC<ArticlesPerPageComponentProps> = props => {
  const [valid, setValid] = useState(isValidPageSize(props.pageSize, props.pageSize))
  const [value, setInputValue] = useState(`${props.pageSize}`)

  const calculatedPageNumber = Math.floor(((props.pageNumber - 1) * props.pageSize) / Number(value)) + 1

  const onChange = (newValue: string) => {
    const isValid = isValidPageSize(newValue, props.pageSize);
    setValid(isValid)
    setInputValue(newValue)
  }

  return (
    <div className="common__flex common__flex-justify-content-flex-end" style={{padding: '1em 0'}}>
      <div className="common__flex-align-items-flex-end" style={{fontSize: '14pt'}}>
        Articles per page
      </div>
      <div id="page-size-input" className="common__flex-align-items-flex-end"
           style={{padding: '0 1em', fontSize: '14pt'}}>
        <div style={{width: '2em'}}>
          <Input value={value} onChange={onChange} />
        </div>
      </div>
      <div>
        <Link to={props.linkCreator(calculatedPageNumber, Number(value))}>
          <Button value="Apply" disabled={!valid}/>
        </Link>
      </div>
    </div>
  )
}