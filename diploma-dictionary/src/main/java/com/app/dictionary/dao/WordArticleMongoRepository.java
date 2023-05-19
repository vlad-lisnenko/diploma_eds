package com.app.dictionary.dao;

import com.app.dictionary.model.WordAndMorphology;
import com.app.dictionary.model.WordArticle;
import com.app.dictionary.model.WordArticleSearchResult;
import com.app.dictionary.model.WordArticleWithCloseWords;
import com.app.dictionary.util.WordUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static java.lang.String.format;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Slf4j
@Component
@RequiredArgsConstructor
public class WordArticleMongoRepository {
    private final MongoTemplate mongoTemplate;

    public WordArticle save(WordArticle multiLanguageWord, String collection) {
        mongoTemplate.indexOps(collection).ensureIndex(new Index("firstLanguageWords.wordsAndMorphologies.word", Sort.Direction.ASC));
        mongoTemplate.indexOps(collection).ensureIndex(new Index("mainFirstLanguageWord", Sort.Direction.ASC));
        mongoTemplate.indexOps(collection).ensureIndex(new Index("otherLanguageWords.wordsAndMorphologies.word", Sort.Direction.ASC));

        TextIndexDefinition textIndexDefinition = new TextIndexDefinition.TextIndexDefinitionBuilder()
                .onField("firstLanguageWords.wordsAndMorphologies.ngrams")
                .onField("otherLanguageWords.wordsAndMorphologies.ngrams")
                .withDefaultLanguage("none")
                .withLanguageOverride("text_language")
                .build();
        mongoTemplate.indexOps(collection).ensureIndex(textIndexDefinition);

        return mongoTemplate.save(multiLanguageWord, collection);
    }

    public Optional<WordArticle> findById(String id, String collection) {
        return Optional.ofNullable(mongoTemplate.findById(id, WordArticle.class, collection));
    }

    public WordArticleSearchResult findByWordStartWith(String wordPart, String collection, PageRequest pageRequest) {
        if (!mongoTemplate.collectionExists(collection)) {
            return new WordArticleSearchResult(Collections.emptyList(), 0);
        }

        Query query = query(where("firstLanguageWords.wordsAndMorphologies.word").regex(format("^%s.*", wordPart), "i"));
        selectFieldsForSearch(query);

        List<WordArticle> wordArticles = mongoTemplate.find(Query.of(query).with(pageRequest), WordArticle.class, collection);
        long count = mongoTemplate.count(query, collection);
        return new WordArticleSearchResult(wordArticles, count);
    }

    public WordArticleSearchResult findByOtherLanguageWordsStartWith(String prefix, String collection, PageRequest pageRequest) {
        if (!mongoTemplate.collectionExists(collection)) {
            return new WordArticleSearchResult(Collections.emptyList(), 0);
        }

        Query query = query(where("otherLanguageWords.wordsAndMorphologies.word").regex(format("^%s.*", prefix), "i"));
        List<WordArticle> wordArticles = mongoTemplate.find(Query.of(query).with(pageRequest), WordArticle.class, collection);
        long count = mongoTemplate.count(query, collection);
        return new WordArticleSearchResult(wordArticles, count);
    }

    public WordArticleSearchResult findByWordPart(String wordPart, String collection, PageRequest pageRequest) {
        if (!mongoTemplate.collectionExists(collection)) {
            return new WordArticleSearchResult(Collections.emptyList(), 0);
        }

        String wordForSearch = wordPart.toLowerCase();

        BasicQuery basicQuery = getSearchByWordQuery(wordForSearch);
//        basicQuery.setSortObject(Document.parse("{score:{$meta:\"textScore\"}, \"firstLanguageWords.wordsAndMorphologies.word\": 1}"));
        basicQuery.setSortObject(Document.parse("{score:{$meta:\"textScore\"}}"));
        selectFieldsForSearch(basicQuery);

        List<WordArticle> wordArticles = mongoTemplate.find(Query.of(basicQuery).with(pageRequest), WordArticle.class, collection);
        long count = mongoTemplate.count(basicQuery, collection);
        return new WordArticleSearchResult(wordArticles, count);
    }

    public List<WordArticle> findAll(String collection) {
        return mongoTemplate.findAll(WordArticle.class, collection);
    }

    public void deleteById(String id, String collection) {
        mongoTemplate.remove(query(where("_id").is(id)), collection);
    }

    private BasicQuery getSearchByWordQuery(String wordForSearch) {
        String query = format("{$or: [{\"firstLanguageWords.wordsAndMorphologies.word\":{$regex: \".*%s.*\", $options: \"i\"}}, {\"otherLanguageWords.wordsAndMorphologies.word\":{$regex: \".*%s.*\", $options: \"i\"}}, {$text: {$search: \"%s\"}}]}", wordForSearch, wordForSearch, WordUtils.getNgramsForWord(wordForSearch));
        return new BasicQuery(query);
    }

    private void selectFieldsForSearch(Query basicQuery) {
        basicQuery.fields().slice("firstLanguageWords.definitions", 1).slice("otherLanguageWords.definitions", 1);
    }

    public Optional<WordArticleWithCloseWords> findByIdWithCloseWords(String id, String collection) {
        WordArticle wordArticle = mongoTemplate.findById(id, WordArticle.class, collection);
        if (wordArticle == null) {
            return Optional.empty();
        }

        Query queryLeftWord = query(where("mainFirstLanguageWord").lt(wordArticle.getFirstLanguageWords().get(0).getWordsAndMorphologies().get(0).getWord())).with(Sort.by(Sort.Direction.DESC, "mainFirstLanguageWord")).limit(1);
//        queryLeftWord.fields().include("mainFirstLanguageWord");
        WordArticle leftWordAsArticle = mongoTemplate.findOne(queryLeftWord, WordArticle.class, collection);

        Query queryRightWord = query(where("mainFirstLanguageWord").gt(wordArticle.getFirstLanguageWords().get(0).getWordsAndMorphologies().get(0).getWord())).with(Sort.by(Sort.Direction.ASC, "mainFirstLanguageWord")).limit(1);
//        queryRightWord.fields().include("mainFirstLanguageWord");
        WordArticle rightWordAsArticle = mongoTemplate.findOne(queryRightWord, WordArticle.class, collection);

        WordArticleWithCloseWords word = new WordArticleWithCloseWords(leftWordAsArticle, wordArticle, rightWordAsArticle);

        return Optional.of(word);
    }

    public Optional<String> findWordByExactMatch(String word, String collectionName) {
        Query query = query(where("firstLanguageWords.wordsAndMorphologies.word").regex(format("^%s$", word), "i"));
        Optional<WordArticle> article = Optional.ofNullable(mongoTemplate.findOne(query, WordArticle.class, collectionName));
        return article.flatMap(wordArticle -> wordArticle.getFirstLanguageWords().stream()
                .flatMap(firstLanguageWords -> firstLanguageWords.getWordsAndMorphologies().stream())
                .map(WordAndMorphology::getWord)
                .filter(it -> it.contains(word))
                .findFirst());
    }

    public void removeByParsingInstant(Instant parsingInstant, String collectionName) {
        mongoTemplate.findAllAndRemove(query(where("parsingInstant").is(parsingInstant)), collectionName);
    }
}
