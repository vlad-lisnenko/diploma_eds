package com.app.dictionary.service.parser.docx;

import lombok.Builder;

@Builder
public class GermanWordResolver extends AbstractWordResolver {
    private final GermanMorphologyEndingsResolver morphologyEndingsResolver;
    private final GermanMorphologyCategoryResolver morphologyCategoryResolver;

    @Override
    protected MorphologyCategoryResolver getMorphologyCategoryResolver() {
        return morphologyCategoryResolver;
    }

    @Override
    protected MorphologyEndingsResolver getMorphologyEndingsResolver() {
        return morphologyEndingsResolver;
    }
}
