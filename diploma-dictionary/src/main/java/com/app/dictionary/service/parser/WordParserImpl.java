package com.app.dictionary.service.parser;

import com.app.dictionary.model.Word;
import com.app.dictionary.model.WordDefinition;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class WordParserImpl implements WordParser {
    /**
     * [word],[morphology]:[word_definition]
     */
    private static final Pattern WORD_MORPHOLOGY_DEFINITION = Pattern.compile("([^,]*),\\s+([^:]*):\\s*(.*)");
    private final WordDefinitionsParser wordDefinitionsParser;

    public WordParserImpl(
            WordDefinitionsParser wordDefinitionsParser) {
        this.wordDefinitionsParser = wordDefinitionsParser;
    }

    @Override
    public WordConfiguration parse(String wordStr) {
        boolean falseParallel = false;
        Word word = new Word();
        if (wordStr.startsWith("! ")) {
            wordStr = StringUtils.replace(wordStr, "! ", "");
            falseParallel = true;
        }
        Matcher matcher = WORD_MORPHOLOGY_DEFINITION.matcher(wordStr);
        if (matcher.matches()) {
            //todo fix
//            word.setWord(matcher.group(1));
            //TODO:2021-04-10:yen: checkout morphology
//            word.setMorphologyEndings(matcher.group(2));
            List<WordDefinition> wordDefinitions = wordDefinitionsParser.parse(matcher.group(3));
            word.setDefinitions(wordDefinitions);
        }
        return new WordConfiguration(word, falseParallel);
    }
}
