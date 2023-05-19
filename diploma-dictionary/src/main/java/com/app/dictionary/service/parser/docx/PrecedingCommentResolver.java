package com.app.dictionary.service.parser.docx;

import org.apache.poi.xwpf.usermodel.XWPFParagraph;

public interface PrecedingCommentResolver {
    String getPrecedingComment(XWPFParagraph paragraph);
}