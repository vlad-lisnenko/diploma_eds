import React, {FC} from 'react';
import {DictionaryArticle} from "../dictionary/DictionaryArticle";
import {WordArticle} from "../../types/WordArticle";
import './ArticlesList.scss'
import {articleActions, deleteArticle} from "../../redux/actions/articleActions";
import {showMessageWithTimeout} from "../../redux/actions/notificationActions";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../redux/reducers/reducers";
import {handleRequestError} from "../../utils/errorHandlingUtils";

type Props = {
  articles: WordArticle[]
}

export const ArticlesList: FC<Props> = props => {
  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage)
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)
  const dispatch = useDispatch()

  return !firstLanguage || !secondLanguage ? null : (
    <div className="articles-page">
      {props.articles.map(it =>
        <div className="articles-page__article">
          <DictionaryArticle firstWords={it.firstLanguageWords}
                             onDelete={async id => {
                               try {
                                 await deleteArticle(id, firstLanguage.language, secondLanguage.language)
                                 dispatch(articleActions.removeArticleFromList(id))
                                 dispatch(showMessageWithTimeout('Article successfully removed'))
                               } catch (error) {
                                 handleRequestError(dispatch, error)
                               }
                             }}
                             id={it.id}
                             otherWords={it.otherLanguageWords}/>
        </div>
      )}
    </div>
  );
};