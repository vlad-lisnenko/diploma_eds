package com.app.dictionary.service.parser.docx;

import com.app.dictionary.model.WordDefinition;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.util.List;

public interface WordDefinitionResolver {
    WordDefinition getWordDefinition(List<XWPFParagraph> paragraphs, int currentParagraph);
}
