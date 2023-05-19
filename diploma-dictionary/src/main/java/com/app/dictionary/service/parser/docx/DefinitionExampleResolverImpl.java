package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.List;
import java.util.stream.Collectors;

public class DefinitionExampleResolverImpl implements DefinitionExampleResolver {
    @Override
    public String getDefinitionExample(XWPFParagraph paragraph) {
        List<String> italicText = paragraph.getRuns().stream()
                .filter(XWPFRun::isItalic)
                .map(it -> it.getText(0))
                .collect(Collectors.toList());
        return italicText.get(italicText.size() - 1);
    }
}
