package com.app.dictionary.model;

import com.app.dictionary.view.WordArticleView;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@JsonView(WordArticleView.Common.class)
public class WordArticleSearchResult {
    private List<WordArticle> wordArticles;
    private long totalCount;
}
