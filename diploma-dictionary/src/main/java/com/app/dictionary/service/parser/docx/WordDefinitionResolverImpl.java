package com.app.dictionary.service.parser.docx;

import com.app.dictionary.model.EquivalentWordDefinition;
import com.app.dictionary.model.WordDefinition;
import lombok.Builder;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Builder
public class WordDefinitionResolverImpl implements WordDefinitionResolver {
    private final IdiosyncrasyResolver idiosyncrasyResolver;
    private final EqualMeaningResolver equalMeaningResolver;
    private final StylisticMeaningResolver stylisticMeaningResolver;
    private final DefinitionExampleResolver definitionExampleResolver;
    private final EquivalentWordDefinitionResolver equivalentWordDefinitionResolver;

    @Override
    public WordDefinition getWordDefinition(List<XWPFParagraph> paragraphs, int currentParagraph) {
        XWPFParagraph paragraph = paragraphs.get(currentParagraph);

        boolean equalMeaning = equalMeaningResolver.isEqualMeaning(paragraph);
        boolean idiosyncratic = idiosyncrasyResolver.isIdiosyncratic(paragraph);
        String stylisticMeaning = stylisticMeaningResolver.getStylisticMeaning(paragraph);
        String definition = null;
        String example = null;

        Matcher matcher = Pattern.compile("^(\\d+\\s*\\*?\\.\\s*)?" + (stylisticMeaning != null ? stylisticMeaning : "") + "\\s*=?\\s*(.+):(.+?)([;.])?$").matcher(paragraph.getText());

        if (matcher.find()) {
            definition = StringUtils.trim(matcher.group(2));
            example = StringUtils.trim(matcher.group(3));
        }

        List<EquivalentWordDefinition> equivalentWordDefinition = equivalentWordDefinitionResolver.getEquivalentWordDefinition(paragraphs, currentParagraph);

        return WordDefinition.builder()
                .definition(definition)
                .example(example)
                .equivalentDefinitions(equivalentWordDefinition)
                .equalMeaning(equalMeaning)
                .idiosyncraticMeaning(idiosyncratic)
                .stylisticMarker(stylisticMeaning)
                .build();
    }
}
