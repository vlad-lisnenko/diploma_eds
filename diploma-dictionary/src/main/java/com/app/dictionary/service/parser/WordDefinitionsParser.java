package com.app.dictionary.service.parser;

import com.app.dictionary.model.WordDefinition;

import java.util.List;

public interface WordDefinitionsParser {

    List<WordDefinition> parse(String wordDefinitions);
}
