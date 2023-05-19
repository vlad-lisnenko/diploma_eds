package com.app.dictionary.service.parser;

import com.app.dictionary.model.WordArticle;

import java.util.List;

public class WordArticleParser {

    private final List<String> wordArticleStr;

    public WordArticleParser(List<String> wordArticleStr) {
        this.wordArticleStr = wordArticleStr;
    }

    public WordArticle parse(WordParser wordParser) {
        //todo fix
//        WordArticle.Builder wordArticleBuilder = WordArticle.newBuilder();
//        List<Word> otherLanguageWords = new ArrayList<>();
//        for (int wordNum = 0; wordNum < wordArticleStr.size(); wordNum++) {
//            WordConfiguration wordConfig = wordParser.parse(wordArticleStr.get(wordNum));
//            if (wordNum == 0) {
//                if (wordConfig.isFalseParallel()) {
//                    wordArticleBuilder.setFalseParallel(true);
//                }
//                wordArticleBuilder.setWord(wordConfig.getWord());
//                continue;
//            }
//            otherLanguageWords.add(wordConfig.getWord());
//        }
//        return wordArticleBuilder.setOtherLanguageWords(otherLanguageWords).build();
        return WordArticle.builder().build();
    }
}
