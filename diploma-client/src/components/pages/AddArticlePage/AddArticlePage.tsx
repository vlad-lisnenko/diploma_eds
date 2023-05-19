import React, {FC, useState} from 'react';
import './AddArticlePage.scss'
import {WordArticle} from "../../../types/WordArticle";
import ArticleForm from "../../ArticleForm/ArticleForm";
import {saveNewArticle} from "../../../redux/actions/articleActions";
import {showMessageWithTimeout} from "../../../redux/actions/notificationActions";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../../redux/reducers/reducers";
import {Word} from "../../../types/Word";
import {WordDefinition} from "../../../types/WordDefinition";
import {processArticle} from "../../../service/articleService";
import {articleFormActions} from "../../../redux/actions/articleFormActions";
import {handleRequestError} from "../../../utils/errorHandlingUtils";

// let initialFormData: WordArticle = {
//   word: {
//     word: 'Абітурієнт',
//     definitions: [
//       {
//         definition: 'той, хто вступає до вищого або середнього спеціального навчального закладу',
//         equivalentDefinitions: [
//           {
//             definition: 'Bewerber(in) um die Zulassung zu einem Studium'
//           }
//         ],
//         equalMeaning: false,
//         example: 'заява абітурієнта'
//       }
//     ],
//     morphologyEndings: '-а',
//     morphologyCategory: 'ч'
//   },
//   otherLanguageWords: [
//     {
//       word: 'Abiturient',
//       definitions: [
//         {
//           definition: 'випускник середньої школи',
//           example: 'die Abiturienten feiern den Schulabschluss',
//           equalMeaning: false,
//           equivalentDefinitions: []
//         }
//       ],
//       morphologyCategory: 'm',
//       morphologyEndings: '-en, -en'
//     }
//   ],
//   falseParallel: true
// }

// const initialFormData = {
//     "id": "60a7a884196f9231d6d2b7d5",
//     "word": {
//       "word": "Решта",
//       "morphologyEndings": "-и",
//       "morphologyCategory": "ж",
//       "definitions": [{
//         "definition": "те, що залишилось невикористаним, невитраченим, незайнятим",
//         "example": "викинути решту",
//         "stylisticMarker": null,
//         "idiosyncraticMeaning": false,
//         "equalMeaning": false
//       }]
//     },
//     "otherLanguageWords": [{
//       "word": "Rest",
//       "morphologyEndings": "-es, -e",
//       "morphologyCategory": "m",
//       "definitions": [{
//         "definition": "решта 1",
//         "example": "der Rest des Vermogens der Rest des Urlaubs, die Reste des Bauwerks",
//         "stylisticMarker": "",
//         "idiosyncraticMeaning": false,
//         "equalMeaning": true
//       }]
//     }],
//     "falseParallel": false
// }

export const AddArticlePage: FC = () => {
  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage)
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)
  const [article, setArticle] = useState(createEmptyArticle())
  // const [article, setArticle] = useState<WordArticle>(initialFormData as unknown as WordArticle)
  const dispatch = useDispatch()

  return !firstLanguage || !secondLanguage ? null : (
    <ArticleForm article={article} submitButtonText="Add" onSubmit={async article => {
      try {
        processArticle(article)
        await saveNewArticle(article, firstLanguage, secondLanguage)
        dispatch(showMessageWithTimeout('Article successfully saved'))
        setArticle(createEmptyArticle())
        dispatch(articleFormActions.clearSecondWords())
      } catch (error) {
        handleRequestError(dispatch, error)
      }
    }} />
  );
};

const createEmptyArticle = (): WordArticle => (
  {
    firstLanguageWords: [createEmptyWord()],
    otherLanguageWords: [createEmptyWord()]
  }
)

const createEmptyWord = (): Word => ({
  definitions: [createDefinition()],
  wordsAndMorphologies: [{
    morphologyCategory: '',
    morphologyEndings: '',
    word: '',
    falseParallel: false
  }]
})

const createDefinition = (): WordDefinition => ({
  equivalentDefinitions: [],
  equalMeaning: false,
  example: '',
  definition: ''
})