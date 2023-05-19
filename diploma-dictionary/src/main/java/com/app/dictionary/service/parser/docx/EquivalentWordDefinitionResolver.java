package com.app.dictionary.service.parser.docx;

import com.app.dictionary.model.EquivalentWordDefinition;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.util.List;

public interface EquivalentWordDefinitionResolver {
    List<EquivalentWordDefinition> getEquivalentWordDefinition(List<XWPFParagraph> paragraphs, int currentParagraph);
}
