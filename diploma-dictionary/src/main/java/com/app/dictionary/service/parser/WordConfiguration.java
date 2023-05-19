package com.app.dictionary.service.parser;

import com.app.dictionary.model.Word;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class WordConfiguration {

    private Word word;
    private boolean falseParallel;
}
