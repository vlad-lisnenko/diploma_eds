import React, {FC} from 'react';
import './DictionaryArticle.scss'
import {Word} from "../../types/Word";
import {ArticleAccordion} from "../ArticleAccordion/ArticleAccordion";

type Props = {
  id: any
  firstWords: Word[],
  otherWords: Word[]
  alwaysExpanded ?: boolean
  hideGoToArticleButton?: boolean
  onDelete?: (id: any) => void
}


export const DictionaryArticle: FC<Props> = props => {

  return (
    <div className='dictionary-article common__flex-center'>
      <div className="dictionary-article__width">
        <ArticleAccordion firstWords={props.firstWords}
                          onDelete={props.onDelete}
                          hideGoToArticleButton={props.hideGoToArticleButton}
                          otherWords={props.otherWords}
                          id={props.id}
                          alwaysExpanded={props.alwaysExpanded}/>
      </div>
    </div>
  );
};
