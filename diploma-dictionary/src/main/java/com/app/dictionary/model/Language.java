package com.app.dictionary.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Pattern;
import java.util.List;

@Document(collection = "languages")
@Data
public class Language {
    @Id
    private String id;

    @Indexed(unique = true)
    @Pattern(regexp = "^[a-zA-Z\\s]+$")
    private String language;

    @Pattern(regexp = "^[\\p{Alpha}\\p{M}\\u200c\\u200d(,\\s+)]+$")
    private List<String> alphabet;
}
