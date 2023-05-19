package com.app.dictionary.service.parser;

import com.app.dictionary.dto.WordArticleLanguages;
import com.app.dictionary.model.WordArticle;
import com.app.dictionary.service.WordArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Slf4j
@Service
@RequiredArgsConstructor
public class DictionaryParserImpl implements DictionaryParser {

    private static final Pattern WORD_ARTICLE_SEPARATOR = Pattern.compile("⁕([⁕ ]+)⁕");
    private static final Pattern NEW_WORD_ARTICLE_DETERMINER = Pattern.compile("^(! )?(\\S+), (-?)([а-я]|[a-z]){1,4}(, [а-я]|[a-z])?(.*):$");

    private final WordParser wordParser;
    private final WordArticleService wordArticleService;

    @Override
    public List<WordArticle> parse(String content, String firstLanguage, String secondLanguage) {
        List<WordArticle> wordArticles = new ArrayList<>();
        List<WordArticleParser> wordArticleParsers = wordArticleParsers(content);
        for (WordArticleParser wordArticleParser : wordArticleParsers) {
            WordArticle wordArticle = wordArticleParser.parse(wordParser);
//todo fix

//            if (wordArticle.getFirstLanguageWords().getWord() == null) {
//                continue;
//            }

            wordArticles.add(wordArticle);
            log.info("Saving wordArticle = {}", wordArticle);
            wordArticleService.save(wordArticle, new WordArticleLanguages(firstLanguage, secondLanguage));
        }
        return wordArticles;
    }

    private List<WordArticleParser> wordArticleParsers(String content) {
        List<WordArticleParser> wordArticleParsers = new ArrayList<>();
        List<String> wordArticle = new ArrayList<>();
        StringBuilder wordBuilder = new StringBuilder();

        String[] lines = content.trim().split("\n");
        for (String line : lines) {
            String pureLine = line.trim();
            if (WORD_ARTICLE_SEPARATOR.matcher(pureLine).matches()) {
                if (!wordArticle.isEmpty()) {
                    wordArticleParsers.add(new WordArticleParser(wordArticle));
                    wordArticle = new ArrayList<>();
                }
                continue;
            }
            if (NEW_WORD_ARTICLE_DETERMINER.matcher(pureLine).matches()) {
                String word = wordBuilder.toString();
                if (isNotBlank(word)) {
                    wordArticle.add(word);
                }
                wordBuilder = new StringBuilder();
            }
            wordBuilder.append(pureLine).append(" ");
        }
        wordArticle.add(wordBuilder.toString());
        wordArticleParsers.add(new WordArticleParser(wordArticle));
        return wordArticleParsers;
    }
}
