package com.app.dictionary.service.parser.docx;

import com.app.dictionary.model.WordAndMorphology;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.util.List;

public interface WordResolver {
    List<WordAndMorphology> getWordsAndMorphologies(XWPFParagraph paragraph);
}
