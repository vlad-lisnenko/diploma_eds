package com.app.dictionary.model;

import com.app.dictionary.view.WordArticleView;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonView(WordArticleView.Common.class)
public class WordAndMorphology {
    @NotBlank(message = "Word is required")
    @Size(max = 50)
    private String word;

    @JsonIgnore
    private String ngrams;

    private String morphologyEndings;

    private String morphologyCategory;

    private boolean falseParallel;
}
