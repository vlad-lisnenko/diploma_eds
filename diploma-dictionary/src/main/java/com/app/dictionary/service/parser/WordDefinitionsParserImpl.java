package com.app.dictionary.service.parser;

import com.app.dictionary.model.WordDefinition;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WordDefinitionsParserImpl implements WordDefinitionsParser {

    private final WordDefinitionParser wordDefinitionParser;

    public WordDefinitionsParserImpl(WordDefinitionParser wordDefinitionParser) {
        this.wordDefinitionParser = wordDefinitionParser;
    }

    @Override
    public List<WordDefinition> parse(String wordDefinitions) {
        String[] definitions = wordDefinitions.trim().split(";\\s[0-9]");
        return Arrays.stream(definitions)
                .filter(StringUtils::isNotBlank)
                .map(wordDefinitionParser::parse)
                .collect(Collectors.toList());
    }
}
