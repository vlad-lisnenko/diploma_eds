package com.app.dictionary.service.parser;

import com.app.dictionary.model.WordDefinition;

public interface WordDefinitionParser {

    WordDefinition parse(String wordDefinition);
}
