package com.app.dictionary.service.parser;

import com.app.dictionary.model.WordArticle;

import java.util.List;

public interface DictionaryParser {

    List<WordArticle> parse(String content, String firstLanguage, String secondLanguage);
}
