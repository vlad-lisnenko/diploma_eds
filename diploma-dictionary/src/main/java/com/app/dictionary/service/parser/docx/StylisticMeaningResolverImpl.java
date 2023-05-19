package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.List;
import java.util.regex.Pattern;

public class StylisticMeaningResolverImpl implements StylisticMeaningResolver {

    private static final String COLON = ":";
    private static final Pattern STYLISTIC_MEANING_PATTERN = Pattern.compile("(?U)^(\\d+\\s*\\*?\\s*\\.)?\\s*(-?\\p{Alpha}+)\\s*=?\\s*.+$");
    @Override
    public String getStylisticMeaning(XWPFParagraph paragraph) {
        if (!STYLISTIC_MEANING_PATTERN.matcher(paragraph.getText()).find()) {
            return null;
        }
        List<XWPFRun> runs = paragraph.getRuns();
        for (int i = 0, runsSize = runs.size(); i < runsSize; i++) {
            XWPFRun run = runs.get(i);
            if (run.getText(0) != null && run.getText(0).contains(COLON)) {
                return null;
            }
            if (run.isItalic()) {
                String meaning = run.getText(0).trim();
                if (!meaning.endsWith(".") && runsSize > i + 1 && runs.get(i + 1).getText(0).trim().startsWith(".")) {
                    meaning += ".";
                }
                return meaning;
            }
        }

        return null;
    }
}
