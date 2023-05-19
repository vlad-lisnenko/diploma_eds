package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.List;

public interface MorphologyEndingsResolver {
    String getMorphologyEndings(List<XWPFRun> paragraph);
}
