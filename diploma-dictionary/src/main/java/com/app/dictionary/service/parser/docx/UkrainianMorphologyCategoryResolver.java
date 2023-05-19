package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.List;
import java.util.stream.Collectors;

public class UkrainianMorphologyCategoryResolver implements MorphologyCategoryResolver {
    @Override
    public String getMorphologyCategory(List<XWPFRun> runs) {
        return runs.stream()
                .filter(XWPFRun::isItalic)
                .map(it -> it.getText(0))
                .collect(Collectors.joining(", "));
    }
}
