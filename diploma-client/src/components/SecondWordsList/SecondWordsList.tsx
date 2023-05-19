import React, {FC} from 'react';
import {State} from "../../redux/reducers/reducers";
import {useDispatch, useSelector} from "react-redux";
import {articleFormActions} from "../../redux/actions/articleFormActions";
import './SecondWordsList.scss'

export const SecondWordsList: FC = () => {
  const secondWords = useSelector((state: State) => state.articleForm.secondLanguageWords)
  const activeWord = useSelector((state: State) => state.articleForm.activeSecondWord)
  const dispatch = useDispatch()

  return secondWords.length < 2 ? null : (
    <div>
      <div>
        {secondWords.map((it, wordIndex) => it.wordsAndMorphologies.map((wordAndMorphology, wordAndMorphologyIndex) => (
          wordIndex === activeWord.wordIndex && wordAndMorphologyIndex === activeWord.wordAndMorphologyIndex ?
            <h3 key={`${wordIndex}${wordAndMorphologyIndex}`}
                className="common-pointer word-list-element">
              {wordAndMorphology.word ? wordAndMorphology.word : '[New word]'}
            </h3> :
            <p key={`${wordIndex}${wordAndMorphologyIndex}`}
               className="common-pointer word-list-element"
               onClick={() => dispatch(articleFormActions.setActiveSecondWord({wordIndex, wordAndMorphologyIndex}))}>
              {wordAndMorphology.word ? wordAndMorphology.word : '[New word]'}
            </p>)
          ))}
      </div>
    </div>
  );
};