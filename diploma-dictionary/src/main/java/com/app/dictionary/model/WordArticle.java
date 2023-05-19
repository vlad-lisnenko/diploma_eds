package com.app.dictionary.model;

import com.app.dictionary.view.WordArticleView;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonView(WordArticleView.Common.class)
public class WordArticle {
    private String id;

    @Valid
    private List<Word> firstLanguageWords;

    @JsonIgnore
    private String mainFirstLanguageWord;

    @Valid
    private List<Word> otherLanguageWords;

    @JsonIgnore
    private Instant parsingInstant;
}
