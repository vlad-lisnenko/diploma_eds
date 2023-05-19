package com.app.dictionary.service.parser.docx;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.List;

public class PrecedingCommentResolverImpl implements PrecedingCommentResolver {
    @Override
    public String getPrecedingComment(XWPFParagraph paragraph) {
        List<XWPFRun> runs = paragraph.getRuns();
        StringBuilder precedingComment = new StringBuilder();

        for (int i = 0; i < runs.size(); i++) {
            XWPFRun run = runs.get(i);

            if (run.isItalic()) {
                precedingComment.append(run.getText(0));
                for (i = i + 1; i < runs.size(); i++) {
                    run = runs.get(i);
                    if (run.getText(0) != null && (run.isItalic() || run.getText(0).trim().isEmpty())) {
                        precedingComment.append(run.getText(0));
                    }
                }
            }
        }

        String result = precedingComment.toString().trim().replaceFirst("^-\\s*", "");
        return StringUtils.isBlank(result) ? null : result;
    }
}
