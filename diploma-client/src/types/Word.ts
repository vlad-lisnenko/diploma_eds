import {WordAndMorphology} from "./WordAndMorphology";
import {WordDefinition} from "./WordDefinition";

export type Word = {
  wordsAndMorphologies: WordAndMorphology[]
  definitions: WordDefinition[],
}