package com.app.dictionary.util;

import com.app.dictionary.dto.WordArticleLanguages;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MongoCollectionUtils {
    public static String toCollectionName(WordArticleLanguages languages) {
        return String.format("%s__%s__articles",
                prepareLanguageForCollectionName(languages.getFistLanguage()),
                prepareLanguageForCollectionName(languages.getSecondLanguage())
        );
    }

    public static String prepareLanguageForCollectionName(String language) {
        return language.toLowerCase().trim().replaceAll("\\s+", "_");
    }
}
