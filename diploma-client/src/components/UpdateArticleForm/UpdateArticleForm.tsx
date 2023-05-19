import React, {FC, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {articleActions, fetchArticleByID, updateArticle} from "../../redux/actions/articleActions";
import {State} from '../../redux/reducers/reducers';
import ArticleForm from "../ArticleForm/ArticleForm";
import {showMessageWithTimeout} from "../../redux/actions/notificationActions";
import {useHistory} from "react-router-dom";
import {handleRequestError} from "../../utils/errorHandlingUtils";

type Props = {
  id: any
}

export const UpdateArticleForm: FC<Props> = props => {
  const dispatch = useDispatch()
  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage)
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)
  const history = useHistory()

  useEffect(() => {
    if (firstLanguage && secondLanguage) {
      dispatch(fetchArticleByID(props.id, firstLanguage.language, secondLanguage.language))
    }
    return () => {
      dispatch(articleActions.clearSingleArticle())
    };
  }, [firstLanguage, secondLanguage])

  const articleById = useSelector((state: State) => state.articles.articleById)

  return !articleById || !firstLanguage || !secondLanguage ? null : (
    <ArticleForm article={articleById} onSubmit={async article => {
      try {
        await updateArticle(article, firstLanguage.language, secondLanguage.language)
        dispatch(showMessageWithTimeout('Article successfully updated'))
        history.push('/')
      } catch (error) {
        handleRequestError(dispatch, error)
      }
    }}/>
  );
};