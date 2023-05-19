package com.app.dictionary.service.parser.docx;

import com.app.dictionary.model.Word;
import com.app.dictionary.model.WordAndMorphology;
import com.app.dictionary.model.WordArticle;
import com.app.dictionary.model.WordDefinition;
import lombok.Builder;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static com.app.dictionary.service.parser.docx.DocxParserUtils.isWordParagraph;

@Builder
public class WordArticleParser {
    private static final int FIRST_LANGUAGE_WORDS = 0;
    private static final int SECOND_LANGUAGE_WORDS = 1;
    private final WordResolver firstLanguageWordResolver;
    private final WordResolver secondLanguageWordResolver;
    private final WordDefinitionResolver wordDefinitionResolver;


    /**
     * @return WordArticle or null if article is not valid
     */
    public WordArticle parse(XWPFTableRow articleRow, Instant parsingInstant) {
        List<Word> firstLanguageWords = new ArrayList<>();
        List<Word> secondLanguageWords = new ArrayList<>();
        List<WordDefinition> currentWordDefinitions = new ArrayList<>();
        Word currentWord;
        List<XWPFParagraph> firstLanguageParagraphs = articleRow.getCell(FIRST_LANGUAGE_WORDS).getParagraphs();

        for (int i = 0; i < firstLanguageParagraphs.size(); i++) {
            XWPFParagraph firstLanguageParagraph = firstLanguageParagraphs.get(i);

            if (isWordParagraph(firstLanguageParagraph)) {
                currentWordDefinitions = new ArrayList<>();
                currentWord = new Word();
                currentWord.setDefinitions(currentWordDefinitions);
                List<WordAndMorphology> wordsAndMorphologies = firstLanguageWordResolver.getWordsAndMorphologies(firstLanguageParagraph);
                currentWord.setWordsAndMorphologies(wordsAndMorphologies);
                firstLanguageWords.add(currentWord);
            } else {
                if (firstLanguageParagraph.getText().trim().startsWith("-") || StringUtils.isBlank(firstLanguageParagraph.getText()) || firstLanguageParagraph.getText().contains("⁕ ⁕ ⁕ ⁕ ⁕")) {
                    continue;
                }
                WordDefinition wordDefinition = wordDefinitionResolver.getWordDefinition(firstLanguageParagraphs, i);
                currentWordDefinitions.add(wordDefinition);
            }
        }

        List<XWPFParagraph> secondLanguageParagraphs = articleRow.getCell(SECOND_LANGUAGE_WORDS).getParagraphs();

        for (int i = 0; i < secondLanguageParagraphs.size(); i++) {
            XWPFParagraph secondLanguageParagraph = secondLanguageParagraphs.get(i);
            if (isWordParagraph(secondLanguageParagraph)) {
                currentWordDefinitions = new ArrayList<>();
                currentWord = new Word();
                currentWord.setDefinitions(currentWordDefinitions);
                List<WordAndMorphology> wordsAndMorphologies = secondLanguageWordResolver.getWordsAndMorphologies(secondLanguageParagraph);
                currentWord.setWordsAndMorphologies(wordsAndMorphologies);
                secondLanguageWords.add(currentWord);
            } else {
                if (secondLanguageParagraph.getText().trim().startsWith("-") || StringUtils.isBlank(secondLanguageParagraph.getText())) {
                    continue;
                }
                WordDefinition wordDefinition = wordDefinitionResolver.getWordDefinition(secondLanguageParagraphs, i);
                currentWordDefinitions.add(wordDefinition);
            }
        }

        boolean firstLanguageHasNoWords = firstLanguageWords.stream()
                .mapToLong(it -> it.getWordsAndMorphologies().size())
                .sum() == 0;

        boolean secondLanguageHasNoWords = secondLanguageWords.stream()
                .mapToLong(it -> it.getWordsAndMorphologies().size())
                .sum() == 0;

        if (firstLanguageWords.isEmpty() || firstLanguageHasNoWords || secondLanguageWords.isEmpty() || secondLanguageHasNoWords) {
            return null;
        }

        return WordArticle.builder()
                .firstLanguageWords(firstLanguageWords)
                .otherLanguageWords(secondLanguageWords)
                .parsingInstant(parsingInstant)
                .build();
    }
}
