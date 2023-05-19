package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class GermanMorphologyEndingsResolver implements MorphologyEndingsResolver {

    private static final Pattern ENDINGS = Pattern.compile("\\((.+)\\)");

    @Override
    public String getMorphologyEndings(List<XWPFRun> runs) {
        String morphologyBlock = runs.stream()
                .map(it -> it.getText(0))
                .collect(Collectors.joining());
        Matcher matcher = ENDINGS.matcher(morphologyBlock);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }
}
