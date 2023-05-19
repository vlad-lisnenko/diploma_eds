package com.app.dictionary.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class WordArticleWithCloseWords {
    private WordWithId leftWord;
    private WordArticle wordArticle;
    private WordWithId rightWord;

    public WordArticleWithCloseWords(WordArticle leftWordAsArticle, WordArticle wordArticle, WordArticle rightWordAsArticle) {
        if (leftWordAsArticle != null) {
            WordWithId leftWord = new WordWithId();
            leftWord.setId(leftWordAsArticle.getId());
            leftWord.setWord(leftWordAsArticle.getFirstLanguageWords());
            this.leftWord = leftWord;
        }

        if (rightWordAsArticle != null) {
            WordWithId rightWord = new WordWithId();
            rightWord.setId(rightWordAsArticle.getId());
            rightWord.setWord(rightWordAsArticle.getFirstLanguageWords());
            this.rightWord = rightWord;
        }

        this.wordArticle = wordArticle;
    }

    @Data
    public static class WordWithId {
        private String id;
        private List<String> word;

        public void setWord(List<Word> word) {
            this.word = word.stream().flatMap(it -> it.getWordsAndMorphologies().stream()).map(WordAndMorphology::getWord).collect(Collectors.toList());
        }
    }
}
