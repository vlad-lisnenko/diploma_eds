import React, {FC, useEffect} from 'react';
import {State} from "../../../redux/reducers/reducers";
import {useDispatch, useSelector} from "react-redux";
import {DictionaryArticle} from "../../dictionary/DictionaryArticle";
import './DictionaryPage.scss'
import {fetchWordArticleWithClearWords, wordActions} from "../../../redux/actions/wordActions";
import {Link, useParams} from 'react-router-dom';
import {Arrow} from "../../Arrow";
import {deleteArticle} from "../../../redux/actions/articleActions";
import {showMessageWithTimeout} from "../../../redux/actions/notificationActions";
import {handleRequestError} from "../../../utils/errorHandlingUtils";

type PageParams = {
  articleId: string
}

export const DictionaryArticlePage: FC = () => {
  const dispatch = useDispatch()
  const wordArticle = useSelector((state: State) => state.words.wordArticle)
  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage)
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)
  const {articleId} = useParams<PageParams>()

  useEffect(() => {
    if (firstLanguage && secondLanguage) {
      dispatch(fetchWordArticleWithClearWords(firstLanguage.language.toLowerCase(), secondLanguage.language.toLowerCase(), articleId))
    }

    return () => {
      dispatch(wordActions.clearWordArticle())
    }
  }, [firstLanguage, secondLanguage, articleId])

  return !wordArticle || !firstLanguage || !secondLanguage ? null : (
    <div className="common__flex" style={{padding: '2em 0'}}>
      <div className="dictionary-page__link common__flex-center" style={{flex: `1 1 ${100/3}%`}}>
        <div>
          {!wordArticle.leftWord ? null :
            <Link to={`/articles/${wordArticle.leftWord.id}`}>
              <div>{wordArticle.leftWord.word}</div>
              <div className="dictionary-page__arrow">
                <Arrow/>
              </div>
            </Link>
          }
        </div>
      </div>
      <div className='dictionary-page' style={{flex: `1 1 ${100/3}%`}}>
        <div className='dictionary-page__dictionary-article'>
          {!wordArticle.wordArticle ? null :
            <DictionaryArticle alwaysExpanded
                               onDelete={async id => {
                                 try {
                                   await deleteArticle(id, firstLanguage.language, secondLanguage.language)
                                   dispatch(wordActions.removeOnlyArticle())
                                   dispatch(showMessageWithTimeout('Article successfully removed'))
                                 } catch (error) {
                                   handleRequestError(dispatch, error)
                                 }
                               }}
                               hideGoToArticleButton={true}
                               id={wordArticle.wordArticle.id}
                               firstWords={wordArticle.wordArticle.firstLanguageWords}
                               otherWords={wordArticle.wordArticle.otherLanguageWords}/>
          }
        </div>
      </div>
        <div className="dictionary-page__link common__flex-center" style={{flex: `1 1 ${100/3}%`}}>
          <div>
            {!wordArticle.rightWord ? null:
              <Link to={`/articles/${wordArticle.rightWord.id}`}>
                {wordArticle.rightWord.word}
                <div className="dictionary-page__right-arrow">
                  <Arrow />
                </div>
              </Link>
            }
          </div>
        </div>
    </div>
  );
};