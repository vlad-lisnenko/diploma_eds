package com.app.dictionary.model;

import com.app.dictionary.view.WordArticleView;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@JsonView(WordArticleView.Common.class)
public class WordDefinition {

    @NotBlank
    @Size(max = 255)
    private String definition;

    @NotBlank
    @Size(max = 255)
    private String example;

    @Size(max = 50)
    private String stylisticMarker;

    /**
     * `*` next to definition number means true.
     */
    private boolean idiosyncraticMeaning;
    private boolean equalMeaning;

    @JsonView(WordArticleView.Full.class)
    private List<EquivalentWordDefinition> equivalentDefinitions;

    public WordDefinition() {
    }

    public WordDefinition(String definition, @Nullable String example) {
        this.definition = definition;
        this.example = example;
    }
}
