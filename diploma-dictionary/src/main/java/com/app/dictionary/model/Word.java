package com.app.dictionary.model;

import com.app.dictionary.view.WordArticleView;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonView(WordArticleView.Common.class)
public class Word {
    private List<WordAndMorphology> wordsAndMorphologies;

    @Valid
    private List<WordDefinition> definitions;
}
