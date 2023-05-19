export type WordDefinition = {
  stylisticMarker?: string,
  definition?: string,
  example?: string,
  idiosyncraticMeaning?: boolean
  equalMeaning: boolean
  equivalentDefinitions?: OtherLanguageEquivalentDefinitions[]
}

export type OtherLanguageEquivalentDefinitions = {
  precedingComment ?: string
  definition: string
}