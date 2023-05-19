package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.List;

public interface MorphologyCategoryResolver {
    String getMorphologyCategory(List<XWPFRun> paragraph);
}
