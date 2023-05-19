package com.app.dictionary.controller;

import com.app.dictionary.dto.UniqueWordResponse;
import com.app.dictionary.dto.WordArticleLanguages;
import com.app.dictionary.model.WordArticle;
import com.app.dictionary.model.WordArticleSearchResult;
import com.app.dictionary.model.WordArticleWithCloseWords;
import com.app.dictionary.service.WordArticleService;
import com.app.dictionary.view.WordArticleView;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/{firstLanguage:^[a-z\\s]+$}/{secondLanguage:^[a-z\\s]+$}")
public class WordArticlesController {

    private static final int MIN_PAGE_SIZE = 10;
    private static final int MAX_PAGE_SIZE = 100;
    private final WordArticleService wordArticleService;

    @PostMapping
    void save(@PathVariable String firstLanguage, @PathVariable String secondLanguage, @Valid @RequestBody WordArticle wordArticle) {
        wordArticleService.save(wordArticle, new WordArticleLanguages(firstLanguage, secondLanguage));
    }

    @GetMapping("/{id}")
    Optional<WordArticle> findById(@PathVariable String firstLanguage, @PathVariable String secondLanguage,
                                   @PathVariable String id) {
        return wordArticleService.findById(id, new WordArticleLanguages(firstLanguage, secondLanguage));
    }

    @GetMapping("/{id}/with-close-words")
    Optional<WordArticleWithCloseWords> findByIdWithCloseWords(@PathVariable String firstLanguage, @PathVariable String secondLanguage,
                                                               @PathVariable String id) {
        return wordArticleService.findByIdWithCloseWords(id, new WordArticleLanguages(firstLanguage, secondLanguage));
    }

    @PutMapping("/{id}")
    WordArticle update(@PathVariable String firstLanguage, @PathVariable String secondLanguage, @PathVariable String id, @RequestBody @Valid WordArticle wordArticle) {
        if (!StringUtils.equals(id, wordArticle.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Id doesn't match");
        }
        return wordArticleService.update(wordArticle, new WordArticleLanguages(firstLanguage, secondLanguage));
    }

    @JsonView(WordArticleView.Common.class)
    @GetMapping("/prefix/{wordPrefix}")
    WordArticleSearchResult findByWordStartingWith(@PathVariable String firstLanguage,
                                                   @PathVariable String secondLanguage,
                                                   @PathVariable String wordPrefix,
                                                   @RequestParam int pageSize,
                                                   @RequestParam int pageNumber,
                                                   @RequestParam(required = false) Boolean isSecondLanguage) {
        if (pageSize < MIN_PAGE_SIZE || pageSize > MAX_PAGE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid page size number");
        }

        if (Boolean.TRUE.equals(isSecondLanguage)) {
            return wordArticleService.findByOtherLanguageWordsStartWith(wordPrefix, new WordArticleLanguages(firstLanguage, secondLanguage), pageSize, pageNumber);
        }
        return wordArticleService.findByWordStartWith(wordPrefix, new WordArticleLanguages(firstLanguage, secondLanguage), pageSize, pageNumber);
    }

    @JsonView(WordArticleView.Common.class)
    @GetMapping("/search/{wordPart}")
    WordArticleSearchResult findByWordsContain(@PathVariable String firstLanguage,
                                               @PathVariable String secondLanguage,
                                               @PathVariable String wordPart,
                                               @RequestParam int pageSize,
                                               @RequestParam int pageNumber) {
        System.out.println("wordPart: " + wordPart);
        if (pageSize < MIN_PAGE_SIZE || pageSize > MAX_PAGE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid page size number");
        }

        WordArticleLanguages languages = new WordArticleLanguages(firstLanguage, secondLanguage);
        return wordArticleService.findByWordPart(languages, wordPart, pageSize, pageNumber);
    }

    @GetMapping("/unique/{word}")
    ResponseEntity<UniqueWordResponse> findWordByExactMatch(@PathVariable String firstLanguage,
                                                            @PathVariable String secondLanguage,
                                                            @PathVariable String word) {
        return ResponseEntity.of(wordArticleService.findWordByExactMatch(word, new WordArticleLanguages(firstLanguage, secondLanguage)));
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable String firstLanguage, @PathVariable String secondLanguage, @PathVariable String id) {
        wordArticleService.remove(id, new WordArticleLanguages(firstLanguage, secondLanguage));
    }
}
