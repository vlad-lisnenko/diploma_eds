package com.app.dictionary.service.parser.docx;

import com.app.dictionary.model.EquivalentWordDefinition;
import com.app.dictionary.model.Word;
import com.app.dictionary.model.WordAndMorphology;
import com.app.dictionary.model.WordArticle;
import com.app.dictionary.model.WordDefinition;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Arrays.asList;
import static java.util.Collections.emptyList;
import static org.junit.jupiter.api.Assertions.assertEquals;

class WordArticleParserTest {

    private WordArticleParser parser;
    private XWPFDocument xwpfDocument;
    private final Instant parsingInstant = Instant.now();

    @BeforeEach
    void setUp() throws IOException {
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
        xwpfDocument = new XWPFDocument(getClass().getClassLoader().getResourceAsStream("test.docx"));

    }

    @Test
    @Disabled
    public void delete() throws Exception {
        XWPFDocument xwpfDocument = new XWPFDocument(Files.newInputStream(Paths.get("src/test/resources/Slovnyk_04_10.docx")));
        List<WordArticle> articles = new ArrayList<>();
        for (XWPFTable table : xwpfDocument.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                WordArticle article = parser.parse(row, parsingInstant);
                articles.add(article);
            }
        }
        new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT).writeValue(new File("articles1.json"), articles);


        String articlesJson = Files.lines(Paths.get("articles.json")).collect(Collectors.joining("\n"));
        String articles1 = Files.lines(Paths.get("articles1.json")).collect(Collectors.joining("\n"));
        assertEquals(articlesJson, articles1);
    }

    @Test
    public void shouldParseWordArticleFromDocxFile() throws Exception {
        WordArticle expected = getExpectedWordArticle();

        WordArticle actual = parser.parse(xwpfDocument.getTables().get(0).getRow(0), parsingInstant);

        assertEquals(expected, actual);
    }

    @Test
    public void shouldParseWordArticleWithOneDefinition() throws JsonProcessingException {
        WordArticle expected = WordArticle.builder()
                .firstLanguageWords(asList(
                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .word("АБІТУРІЄНТ")
                                                .falseParallel(true)
                                                .morphologyEndings("-а")
                                                .morphologyCategory("ч")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .definition("той, хто вступає до вищого або середнього спеціального навчального закладу")
                                                .example("заява абітурієнта")
                                                .equivalentDefinitions(asList(
                                                        EquivalentWordDefinition.builder()
                                                                .definition("Bewerber(in) um die Zulassung zu einem Studium")
                                                                .build()
                                                ))
                                                .build()
                                ))
                                .build()
                ))
                .otherLanguageWords(asList(
                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .word("Abiturient")
                                                .falseParallel(true)
                                                .morphologyCategory("m")
                                                .morphologyEndings("-en, -en")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .definition("випускник середньої школи")
                                                .example("die Abiturienten feiern den Schulabschluss")
                                                .equivalentDefinitions(emptyList())
                                                .build()
                                ))
                                .build()
                ))
                .parsingInstant(parsingInstant)
                .build();

        WordArticle actual = parser.parse(xwpfDocument.getTables().get(0).getRow(1), parsingInstant);

        assertEquals(expected, actual);
    }

    @Test
    public void shouldParseArticleWithPrecedingComment() throws JsonProcessingException {
        WordArticle expected = WordArticle.builder()
                .parsingInstant(parsingInstant)
                .firstLanguageWords(asList(
                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .word("АВАРІ/Я")
                                                .morphologyEndings("-ї")
                                                .morphologyCategory("ж")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .definition("значне пошкодження механізму під час дії; пошкодження, вихід із ладу, руйнування, що сталося з технологічних, експлуатаційних або природних причин")
                                                .example("усунути аварію, сталася аварія, потрапити в аварію")
                                                .equivalentDefinitions(asList(
                                                        EquivalentWordDefinition.builder()
                                                                .precedingComment("а ткж")
                                                                .definition("Panne")
                                                                .build()
                                                ))
                                                .build(),
                                        WordDefinition.builder()
                                                .definition("крах автомобілів, літаків, кораблів без людських жертв")
                                                .example("спостерігати аварію літака")
                                                .equivalentDefinitions(asList(
                                                        EquivalentWordDefinition.builder()
                                                                .precedingComment("а ткж")
                                                                .definition("Unfall")
                                                                .build()
                                                ))
                                                .build(),
                                        WordDefinition.builder()
                                                .idiosyncraticMeaning(true)
                                                .stylisticMarker("розм.")
                                                .definition("невдача, несподіване порушення перебігу якоїсь справи; нещастя")
                                                .example("аварія вдома")
                                                .equivalentDefinitions(asList(
                                                        EquivalentWordDefinition.builder()
                                                                .definition("Ausfall")
                                                                .build()
                                                ))
                                                .build()
                                ))
                                .build()
                ))
                .otherLanguageWords(asList(
                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .word("Havarie")
                                                .morphologyCategory("f")
                                                .morphologyEndings("=, -n")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .stylisticMarker("заст.")
                                                .equalMeaning(true)
                                                .definition("аварія 1")
                                                .example("zu einer Havarie führen")
                                                .equivalentDefinitions(emptyList())
                                                .build(),
                                        WordDefinition.builder()
                                                .stylisticMarker("заст.")
                                                .equalMeaning(true)
                                                .definition("аварія 2")
                                                .example("eine Havarie beobachten")
                                                .equivalentDefinitions(emptyList())
                                                .build()
                                ))
                                .build()
                )).build();

        WordArticle actual = parser.parse(xwpfDocument.getTables().get(0).getRow(2), parsingInstant);
        assertEquals(expected, actual);
    }

    private WordArticle getExpectedWordArticle() throws Exception {
        return WordArticle.builder()
                .parsingInstant(parsingInstant)
                .firstLanguageWords(asList(
                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .word("АКТ I")
                                                .morphologyEndings("-у")
                                                .morphologyCategory("ч")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .equalMeaning(false)
                                                .idiosyncraticMeaning(false)
                                                .definition("окремий прояв якої-н. почуттів, стосунків, ставлення до людей")
                                                .example("акт милосердя")
                                                .equivalentDefinitions(emptyList())
                                                .build(),
                                        WordDefinition.builder()
                                                .equalMeaning(false)
                                                .idiosyncraticMeaning(true)
                                                .stylisticMarker("мед.")
                                                .definition("статеві відносини")
                                                .example("задоволення від акту")
                                                .equivalentDefinitions(asList(
                                                        EquivalentWordDefinition.builder()
                                                                .definition("Sexualakt")
                                                                .build()
                                                ))
                                                .build()
                                ))
                                .build(),

                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .word("АКТ II")
                                                .morphologyEndings("-у")
                                                .morphologyCategory("ч")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .equalMeaning(false)
                                                .idiosyncraticMeaning(false)
                                                .definition("закінчена частина театральної вистави, драматичного твору; дія")
                                                .equivalentDefinitions(emptyList())
                                                .example("другий акт п'єси")
                                                .build()
                                ))
                                .build(),

                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .falseParallel(true)
                                                .word("AKT III")
                                                .morphologyEndings("-а")
                                                .morphologyCategory("ч")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .equalMeaning(false)
                                                .idiosyncraticMeaning(false)
                                                .definition("закон, писаний указ, грамота, постанова державного, суспільного значення")
                                                .example("Акт незалежності")
                                                .equivalentDefinitions(asList(
                                                        EquivalentWordDefinition.builder()
                                                        .definition("Gesetz")
                                                        .build(),
                                                        EquivalentWordDefinition.builder()
                                                                .definition("Verordnung")
                                                                .build(),
                                                        EquivalentWordDefinition.builder()
                                                                .definition("Vertrag")
                                                                .build()
                                                ))
                                                .build(),
                                        WordDefinition.builder()
                                                .equalMeaning(false)
                                                .idiosyncraticMeaning(false)
                                                .definition("офіційний документ, протокол, запис про який-н. факт")
                                                .example("нормативний акт, акт ревізії")
                                                .equivalentDefinitions(asList(EquivalentWordDefinition.builder()
                                                        .definition("Protokoll")
                                                        .build()))
                                                .build()
                                ))
                                .build()
                ))
                .otherLanguageWords(asList(
                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .word("Akt I")
                                                .morphologyEndings("-(e)s, -e")
                                                .morphologyCategory("m")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .equalMeaning(true)
                                                .definition("акт І, 1")
                                                .equivalentDefinitions(emptyList())
                                                .example("Akt der Höflichkeit")
                                                .build()
                                ))
                                .build(),

                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .word("Akt II")
                                                .morphologyEndings("-(e)s, -e")
                                                .morphologyCategory("m")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .equalMeaning(true)
                                                .definition("акт ІІ")
                                                .equivalentDefinitions(emptyList())
                                                .example("Pause nach dem zweiten Akt")
                                                .build()
                                ))
                                .build(),

                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .falseParallel(true)
                                                .word("Akt III")
                                                .morphologyEndings("-(e)s, -e")
                                                .morphologyCategory("m")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .definition("зображення оголеного тіла")
                                                .equivalentDefinitions(emptyList())
                                                .example("einen Akt malen")
                                                .build()
                                ))
                                .build(),

                        Word.builder()
                                .wordsAndMorphologies(asList(
                                        WordAndMorphology.builder()
                                                .falseParallel(true)
                                                .word("Akte")
                                                .morphologyEndings("=, -n")
                                                .morphologyCategory("f, австр")
                                                .build(),
                                        WordAndMorphology.builder()
                                                .falseParallel(false)
                                                .word("Akt IV")
                                                .morphologyEndings("-(e)s, -e")
                                                .morphologyCategory("m")
                                                .build()
                                ))
                                .definitions(asList(
                                        WordDefinition.builder()
                                                .definition("папка (справа) зі службовою (судовою) документацією")
                                                .example("eine Akte anlegen, einen Akt anlegen")
                                                .equivalentDefinitions(emptyList())
                                                .build()
                                ))
                                .build()
                )).build();
    }
}