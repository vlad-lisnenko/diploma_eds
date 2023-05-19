package com.app.dictionary.service.parser;

import com.app.dictionary.model.EquivalentWordDefinition;
import com.app.dictionary.model.WordDefinition;
import com.google.common.collect.ImmutableList;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
public class WordDefinitionParserImpl implements WordDefinitionParser {

    /**
     * 0-9[idiosyncraticMeaning].[equalMeaning][word_definition]:[example]-[equivalent_definitions_separated_with_comma].
     */
    private final Pattern DEFINITION_EXAMPLE_EQUIVALENT_DEFINITIONS = Pattern.compile("[0-9]?\\s*(\\*?)\\.?\\s*(=?)\\s*(.*)[0-9]?:\\s*([^-]*)\\s*-?\\s*(.*)");

    @Override
    public WordDefinition parse(String wordDefinitionStr) {
        WordDefinition wordDefinition = new WordDefinition();
        Matcher matcher = DEFINITION_EXAMPLE_EQUIVALENT_DEFINITIONS.matcher(wordDefinitionStr);
        if (matcher.find()) {
            wordDefinition.setIdiosyncraticMeaning(isNotBlank(matcher.group(1)));
            wordDefinition.setEqualMeaning(isNotBlank(matcher.group(2)));
            //TODO:2021-05-09:yen: take a look at stylistic marker. E.g. `мат`
//            wordDefinition.setStylisticMarker();
            wordDefinition.setDefinition(matcher.group(3));
            wordDefinition.setExample(matcher.group(4));
            wordDefinition.setEquivalentDefinitions(equivalentWordDefinitions(matcher.group(5)));
        }
        return wordDefinition;
    }

    private List<EquivalentWordDefinition> equivalentWordDefinitions(String equivalentDefinitions) {
        if (StringUtils.isBlank(equivalentDefinitions)) {
            return ImmutableList.of();
        }
        return Arrays.stream(equivalentDefinitions.split(","))
                //TODO:2021-05-10:yen: checkout preceding comment
                .map(definition -> new EquivalentWordDefinition(null, definition))
                .collect(Collectors.toList());
    }
}
