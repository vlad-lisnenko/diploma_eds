package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.List;
import java.util.StringJoiner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class UkrainianMorphologyEndingsResolver implements MorphologyEndingsResolver {
    private static final Pattern ENDINGS = Pattern.compile("(?U)(-\\p{Alpha})");

    @Override
    public String getMorphologyEndings(List<XWPFRun> runs) {
        String endingsWithCategory = runs.stream()
                .map(it -> it.getText(0))
                .collect(Collectors.joining());

        StringJoiner result = new StringJoiner(", -");
        Matcher matcher = ENDINGS.matcher(endingsWithCategory);
        while (matcher.find()) {
            result.add(matcher.group(1));
        }

        return result.toString();
    }
}
