import React, {FC, useState} from 'react';
import './ArticleAccordion.scss'
import {Word} from "../../types/Word";
import {Accordion, AccordionDetails, AccordionSummary, createStyles, makeStyles, Theme} from "@material-ui/core";
import {WordDefinition} from "../../types/WordDefinition";
import {Button} from "../controls/Button";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {Secured} from "../Secured";
import {State} from "../../redux/reducers/reducers";

type Props = {
  id: any
  firstWords: Word[]
  otherWords: Word[]
  alwaysExpanded?: boolean
  hideGoToArticleButton?: boolean
  onDelete?: (id: any) => void
}

const mapWordsToString = (words: Word[]) =>
  words.flatMap(word => word.wordsAndMorphologies)
    .map(wordAndMorphologies => (
        <span>
        {wordAndMorphologies.falseParallel ?
          <img className="article-accordion__false-parallel" src="/assets/false_parallel.svg"
               alt="false parallel meaning"/> : null}
          <span>{wordAndMorphologies.word}</span>
      </span>
      )
    ).reduce(((previousValue, currentValue) => <>{previousValue}<span>, </span>{currentValue}</>))


export const ArticleAccordion: FC<Props> = props => {
  const [expanded, setExpanded] = useState(false)
  const firstLanguage = useSelector((state: State) => state.dictionaryDetails.firstLanguage)
  const secondLanguage = useSelector((state: State) => state.dictionaryDetails.secondLanguage)
  const classes = useStyles()

  return !firstLanguage || !secondLanguage ? null : (
    <Accordion expanded={expanded || props.alwaysExpanded} onChange={() => setExpanded(!expanded)} classes={classes}>
      {!expanded && !props.alwaysExpanded ?
        <AccordionSummary>
          <div className="article-accordion__word common__flex">
            <div style={{flex: `1 1 ${95 / 2}%`}}>
              {/*<span style={{overflowWrap: 'anywhere'}}>{props.firstWords.word}</span>*/}
              <span style={{overflowWrap: 'anywhere'}}>
                {mapWordsToString(props.firstWords)}
              </span>
            </div>
            <div className="common__flex-center" style={{flex: `1 1 5%`, color: '#bcbcbc'}}><span>|</span></div>
            <div className="common__flex-justify-content-flex-end" style={{flex: `1 1 ${95 / 2}%`}}>
              <span>
                {mapWordsToString(props.otherWords)}
              </span>
            </div>
          </div>
        </AccordionSummary>
        : null
      }
      {props.firstWords.map(it => mapWordsToAccordionContent(it, secondLanguage.language.toLowerCase()))}
      <div className="common__flex-center">
        <div className="line"/>
      </div>
      {props.otherWords.map(it => mapWordsToAccordionContent(it, secondLanguage.language.toLowerCase()))}
      <div hidden={props.hideGoToArticleButton} className="common__padding-1em">
        <Link to={`/articles/${props.id}`}>
          <Button value="Go to article"/>
        </Link>
      </div>
      <Secured>
        <div className="common__flex">
          <div className="common__padding-1em">
            <Link to={`/articles/${props.id}/edit`}>
              <Button value="Edit"/>
            </Link>
          </div>
          <div className="common__padding-1em">
            <Button value="Remove" color="secondary" onClick={() => props.onDelete?.(props.id)}/>
          </div>
        </div>
      </Secured>
    </Accordion>
  );
};

const mapWordsToAccordionContent = (word: Word, secondLanguage: string) => (
  <>
    <AccordionSummary>
      <div className="article-accordion__word">
        {word.wordsAndMorphologies.map(it => (
          <>
            {it.falseParallel ?
              <img className="article-accordion__false-parallel" src="/assets/false_parallel.svg"
                   alt="false parallel meaning"/> : null}
            <span style={{overflowWrap: 'anywhere'}}>
              {it.word}
            </span>
            <div>
              {morphologyMapper[secondLanguage] ? morphologyMapper[secondLanguage](it.morphologyEndings, it.morphologyCategory) : morphologyMapper['german'](it.morphologyEndings, it.morphologyCategory)}
            </div>
          </>
        ))}
      </div>
    </AccordionSummary>
    <AccordionDetails>
      <div>
        <div>
          {word.definitions.map((value, index) => mapDefinition(value, index, word.definitions.length > 1, word.definitions.length))}
        </div>
      </div>
    </AccordionDetails>
  </>
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
    },
  }),
);

const morphologyMapper: any = {
  'german': (morphologyEndings: string[], morphologyCategory: string) => {
    return <>
      {morphologyCategory ? <i>{morphologyCategory} </i> : null}
      {morphologyEndings ? `(${morphologyEndings})` : null}
    </>
  },
  'ukrainian': (morphologyEndings: string[], morphologyCategory: string) => {
    return <>
      {morphologyEndings}
      <i>{morphologyCategory && morphologyEndings.length > 0 ? `, ${morphologyCategory}` : morphologyCategory}</i>
    </>
  }
}

const placeFinalSymbol = (number: number, moreThanOne: boolean, totalCount: number) => {
  return !moreThanOne ? '.' : totalCount === number + 1 ? '.' : ';'
}

const finalCharacters = /[^.;!?]/g

const placeFinalSymbolForDefinition = (number: number, moreThanOne: boolean, totalCount: number, definition: WordDefinition) => {
  if (definition.example && definition.example.substring(definition.example.length - 1).match(finalCharacters) && (definition.equivalentDefinitions || []).length < 1) {
    return placeFinalSymbol(number, moreThanOne, totalCount)
  } else {
    return ''
  }
}

const mapDefinition = (definition: WordDefinition, number: number, moreThanOne: boolean, totalCount: number) => {
  const isDefinitionsPresent = (definition.equivalentDefinitions || []).length > 0;
  return <div key={number}>
    {(moreThanOne ? `${number + 1}${definition.idiosyncraticMeaning ? '*' : ''}.` : '')}
    <i>{definition.stylisticMarker?.padStart(definition.stylisticMarker?.length + 1)}</i>
    {definition.equalMeaning ? '= ' : ''}
    {` ${definition.definition}: `}
    <i>{definition.example}</i>{placeFinalSymbolForDefinition(number, moreThanOne, totalCount, definition)}
    <div>
      {isDefinitionsPresent ? '- ' : null}
      {!isDefinitionsPresent ? null :
        (definition.equivalentDefinitions || []).map(it => it.precedingComment ? <>
          <i>{it.precedingComment}</i> {it.definition}</> : it.definition)}
      {isDefinitionsPresent ? placeFinalSymbol(number, moreThanOne, totalCount) : null}
    </div>
  </div>
}