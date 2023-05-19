package com.app.dictionary.service;

import com.app.dictionary.dto.WordArticleLanguages;
import com.app.dictionary.model.WordArticle;
import com.app.dictionary.service.parser.docx.DefinitionExampleResolverImpl;
import com.app.dictionary.service.parser.docx.EqualMeaningResolverImpl;
import com.app.dictionary.service.parser.docx.EquivalentWordDefinitionResolverImpl;
import com.app.dictionary.service.parser.docx.GermanMorphologyCategoryResolver;
import com.app.dictionary.service.parser.docx.GermanMorphologyEndingsResolver;
import com.app.dictionary.service.parser.docx.GermanWordResolver;
import com.app.dictionary.service.parser.docx.IdiosyncrasyResolverImpl;
import com.app.dictionary.service.parser.docx.OtherLanguageEquivalentResolverImpl;
import com.app.dictionary.service.parser.docx.PrecedingCommentResolverImpl;
import com.app.dictionary.service.parser.docx.StylisticMeaningResolverImpl;
import com.app.dictionary.service.parser.docx.UkrainianMorphologyCategoryResolver;
import com.app.dictionary.service.parser.docx.UkrainianMorphologyEndingsResolver;
import com.app.dictionary.service.parser.docx.UkrainianWordResolver;
import com.app.dictionary.service.parser.docx.WordArticleParser;
import com.app.dictionary.service.parser.docx.WordDefinitionResolverImpl;
import lombok.SneakyThrows;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Service
public class WordArticleParserService {

    private final WordArticleParser parser;
    private final WordArticleService service;

    public WordArticleParserService(WordArticleService service) {
        this.service = service;
        parser = WordArticleParser.builder()
                .firstLanguageWordResolver(UkrainianWordResolver.builder()
                        .morphologyCategoryResolver(new UkrainianMorphologyCategoryResolver())
                        .morphologyEndingsResolver(new UkrainianMorphologyEndingsResolver())
                        .build())
                .secondLanguageWordResolver(GermanWordResolver.builder()
                        .morphologyEndingsResolver(new GermanMorphologyEndingsResolver())
                        .morphologyCategoryResolver(new GermanMorphologyCategoryResolver())
                        .build())
                .wordDefinitionResolver(WordDefinitionResolverImpl.builder()
                        .definitionExampleResolver(new DefinitionExampleResolverImpl())
                        .equalMeaningResolver(new EqualMeaningResolverImpl())
                        .equivalentWordDefinitionResolver(EquivalentWordDefinitionResolverImpl.builder()
                                .otherLanguageEquivalentResolver(new OtherLanguageEquivalentResolverImpl())
                                .precedingCommentResolver(new PrecedingCommentResolverImpl())
                                .build())
                        .idiosyncrasyResolver(new IdiosyncrasyResolverImpl())
                        .stylisticMeaningResolver(new StylisticMeaningResolverImpl())
                        .build())
                .build();
    }

    @SneakyThrows
    public void parse(MultipartFile file, WordArticleLanguages languages) {
        XWPFDocument document = new XWPFDocument(file.getInputStream());
        Instant parsingInstant = Instant.now();
        try {
            for (XWPFTable table : document.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    WordArticle article = parser.parse(row, parsingInstant);
                    if (article != null) {
                        service.save(article, languages);
                    }
                }
            }
        } catch (Throwable e) {
            service.removeByParsingInstant(languages, parsingInstant);
            throw e;
        }
    }
}
