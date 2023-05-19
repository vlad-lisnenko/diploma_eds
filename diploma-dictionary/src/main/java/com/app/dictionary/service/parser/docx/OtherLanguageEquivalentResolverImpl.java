package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class OtherLanguageEquivalentResolverImpl implements OtherLanguageEquivalentResolver {

    private static final Pattern EQUIVALENT_PATTERN = Pattern.compile("^(.+)[;.]$");

    @Override
    public String getOtherLanguageEquivalent(XWPFParagraph paragraph) {
        String equivalents = paragraph.getRuns().stream()
                .filter(it -> it.getText(0) != null && !it.getText(0).isEmpty() && !it.getText(0).trim().equals("-") && !it.isItalic())
                .map(it -> it.getText(0))
                .collect(Collectors.joining());

        Matcher matcher = EQUIVALENT_PATTERN.matcher(equivalents);
        if (matcher.find()) {
            return matcher.group(1);
        }

        return equivalents;
    }
}
