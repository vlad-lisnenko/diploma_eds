package com.app.dictionary.service.parser.docx;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.List;
import java.util.stream.Collectors;

public class GermanMorphologyCategoryResolver implements MorphologyCategoryResolver {

    @Override
    public String getMorphologyCategory(List<XWPFRun> runs) {
        String categories = runs.stream()
                .filter(XWPFRun::isItalic)
                .map(it -> it.getText(0))
                .filter(it -> it != null && !it.trim().equals(".") && !StringUtils.isBlank(it))
                .collect(Collectors.joining(", "));

        return categories.trim();
    }
}
