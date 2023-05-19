package com.app.dictionary.util;

import com.app.dictionary.model.Word;
import com.app.dictionary.model.WordAndMorphology;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Objects;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class WordArticleUtils {
    public static String getFirstWord(List<Word> words) {
        if (words != null) {
            return words.stream()
                    .flatMap(it -> it.getWordsAndMorphologies().stream())
                    .map(WordAndMorphology::getWord)
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElse(null);
        }

        return null;
    }
}
