package com.app.dictionary.service.parser.docx;

import lombok.Builder;

@Builder
public class UkrainianWordResolver extends AbstractWordResolver {
    private final UkrainianMorphologyEndingsResolver morphologyEndingsResolver;
    private final UkrainianMorphologyCategoryResolver morphologyCategoryResolver;


    @Override
    protected MorphologyCategoryResolver getMorphologyCategoryResolver() {
        return morphologyCategoryResolver;
    }

    @Override
    protected MorphologyEndingsResolver getMorphologyEndingsResolver() {
        return morphologyEndingsResolver;
    }
}
