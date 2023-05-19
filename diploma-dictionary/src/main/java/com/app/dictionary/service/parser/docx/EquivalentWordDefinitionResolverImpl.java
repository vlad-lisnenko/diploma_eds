package com.app.dictionary.service.parser.docx;

import com.app.dictionary.model.EquivalentWordDefinition;
import lombok.Builder;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static org.apache.commons.lang3.StringUtils.startsWith;
import static org.apache.commons.lang3.StringUtils.trim;

@Builder
public class EquivalentWordDefinitionResolverImpl implements EquivalentWordDefinitionResolver {
    private final OtherLanguageEquivalentResolver otherLanguageEquivalentResolver;
    private final PrecedingCommentResolver precedingCommentResolver;


    @Override
    public List<EquivalentWordDefinition> getEquivalentWordDefinition(List<XWPFParagraph> paragraphs, int currentParagraph) {
        if (isNextParagraphExists(paragraphs, currentParagraph) && isStartsWithDash(paragraphs, currentParagraph)) {
            XWPFParagraph paragraph = paragraphs.get(currentParagraph + 1);
            String precedingComment = precedingCommentResolver.getPrecedingComment(paragraph);
            String otherLanguageEquivalents = otherLanguageEquivalentResolver.getOtherLanguageEquivalent(paragraph);
            return Arrays.stream(otherLanguageEquivalents.split(","))
                    .map(StringUtils::trim)
                    .map(it -> new EquivalentWordDefinition(precedingComment, it))
                    .collect(Collectors.toList());
        }
        return emptyList();
    }

    private boolean isStartsWithDash(List<XWPFParagraph> paragraphs, int currentParagraph) {
        return startsWith(trim(paragraphs.get(currentParagraph + 1).getText()), "-");
    }

    private boolean isNextParagraphExists(List<XWPFParagraph> paragraphs, int currentParagraph) {
        return paragraphs.size() > currentParagraph + 1;
    }
}
