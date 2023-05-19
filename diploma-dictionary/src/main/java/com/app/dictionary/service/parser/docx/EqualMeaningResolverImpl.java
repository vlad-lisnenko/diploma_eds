package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.util.regex.Pattern;

public class EqualMeaningResolverImpl implements EqualMeaningResolver {
    private final static Pattern EQUAL_MEANING = Pattern.compile("(?U)^(\\d+\\s*\\.\\s*)?(\\p{Alpha}+\\s*\\.\\s*)?=.*$");

    @Override
    public boolean isEqualMeaning(XWPFParagraph paragraph) {
        return EQUAL_MEANING.matcher(paragraph.getText().trim()).find();
    }
}
