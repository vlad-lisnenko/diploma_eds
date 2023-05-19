package com.app.dictionary.service;

import com.app.dictionary.dto.UniqueWordResponse;
import com.app.dictionary.dto.WordArticleLanguages;
import com.app.dictionary.model.WordArticle;
import com.app.dictionary.model.WordArticleSearchResult;
import com.app.dictionary.model.WordArticleWithCloseWords;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface WordArticleService {

    void save(WordArticle word, WordArticleLanguages languages);

    Optional<WordArticle> findById(String id, WordArticleLanguages languages);

    WordArticleSearchResult findByOtherLanguageWordsStartWith(String germanWordPrefix, WordArticleLanguages languages, int pageSize, int pageNumber);

    WordArticleSearchResult findByWordStartWith(String uaWordPrefix, WordArticleLanguages languages, int pageSize, int pageNumber);

    List<WordArticle> findAll(WordArticleLanguages languages);

    WordArticle update(WordArticle wordArticle, WordArticleLanguages languages);

    void remove(String id, WordArticleLanguages languages);

    WordArticleSearchResult findByWordPart(WordArticleLanguages languages, String wordPart, int pageSize, int pageNumber);

    Optional<WordArticleWithCloseWords> findByIdWithCloseWords(String id, WordArticleLanguages articleLanguages);

    Optional<UniqueWordResponse> findWordByExactMatch(String word, WordArticleLanguages wordArticleLanguages);

    void removeByParsingInstant(WordArticleLanguages languages, Instant parsingInstant);
}
