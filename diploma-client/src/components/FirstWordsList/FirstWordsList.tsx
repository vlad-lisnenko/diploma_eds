import React, {FC} from 'react';
import {State} from "../../redux/reducers/reducers";
import {useDispatch, useSelector} from "react-redux";
import {articleFormActions} from "../../redux/actions/articleFormActions";
import './FirstWordsList.scss'

export const FirstWordsList: FC = () => {
  const firstWords = useSelector((state: State) => state.articleForm.firstLanguageWords)
  const activeWord = useSelector((state: State) => state.articleForm.activeFirstWord)
  const dispatch = useDispatch()

  return firstWords.length < 2 ? null : (
    <div>
      <div>
        {firstWords.map((it, wordIndex) => it.wordsAndMorphologies.map((wordAndMorphology, wordAndMorphologyIndex) => (
          wordIndex === activeWord.wordIndex && wordAndMorphologyIndex === activeWord.wordAndMorphologyIndex ?
            <h3 key={`${wordIndex}${wordAndMorphologyIndex}`}
                className="common-pointer word-list-element">
              {wordAndMorphology.word ? wordAndMorphology.word : '[New word]'}
            </h3> :
            <p key={`${wordIndex}${wordAndMorphologyIndex}`}
               className="common-pointer word-list-element"
               onClick={() => dispatch(articleFormActions.setActiveFirstWord({wordIndex, wordAndMorphologyIndex}))}>
              {wordAndMorphology.word ? wordAndMorphology.word : '[New word]'}
            </p>)
        ))}
      </div>
    </div>
  );
};