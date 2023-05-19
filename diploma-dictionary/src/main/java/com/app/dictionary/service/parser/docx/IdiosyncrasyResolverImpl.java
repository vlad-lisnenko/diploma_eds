package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.util.regex.Pattern;

public class IdiosyncrasyResolverImpl implements IdiosyncrasyResolver {
    private static final Pattern IDIOSYNCRATIC = Pattern.compile("^(\\d+\\s*\\*\\s*\\.).*");

    @Override
    public boolean isIdiosyncratic(XWPFParagraph paragraph) {
        String text = paragraph.getText().trim();
        return IDIOSYNCRATIC.matcher(text).find();
    }
}
