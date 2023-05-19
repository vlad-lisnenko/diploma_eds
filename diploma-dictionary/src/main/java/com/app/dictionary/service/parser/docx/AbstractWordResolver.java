package com.app.dictionary.service.parser.docx;

import com.app.dictionary.model.WordAndMorphology;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractWordResolver implements WordResolver {
    @Override
    public List<WordAndMorphology> getWordsAndMorphologies(XWPFParagraph paragraph) {
        List<WordAndMorphology> result = new ArrayList<>();
        boolean currentFalseParallel = false;
        String word = null;
        List<XWPFRun> runs = paragraph.getRuns();
        List<XWPFRun> morphologyRuns = null;
        for (int i = 0; i < runs.size(); i++) {
            if (runs.get(i).getText(0) == null || runs.get(i).getText(0).isEmpty()) {
                currentFalseParallel = true;
                continue;
            }

            if (runs.get(i).isBold()) {
                morphologyRuns = new ArrayList<>();
                BoldRunsCollectorData boldRunsCollectorData = collectBoldRuns(runs, i);
                word = boldRunsCollectorData.word;
                i = boldRunsCollectorData.nextRunIndex;

                for (; i < runs.size(); i++) {
//                    if (runs.get(i).isBold() && !runs.get(i).getText(0).trim().isEmpty()) {
                    if (runs.get(i).isBold() && DocxParserUtils.isAlphaRun(runs.get(i))) {
                        i = i != 0 && i != runs.size() - 1 ? i - 1 : i;
                        break;
                    }

                    morphologyRuns.add(runs.get(i));
                }

                String morphologyCategory = getMorphologyCategoryResolver().getMorphologyCategory(morphologyRuns);
                String morphologyEndings = getMorphologyEndingsResolver().getMorphologyEndings(morphologyRuns);
                WordAndMorphology wordAndMorphology = WordAndMorphology.builder()
                        .word(word)
                        .falseParallel(currentFalseParallel)
                        .morphologyCategory(morphologyCategory)
                        .morphologyEndings(morphologyEndings)
                        .build();
                result.add(wordAndMorphology);

                currentFalseParallel = false;
            }
        }
        return result;
    }

    private static BoldRunsCollectorData collectBoldRuns(List<XWPFRun> runs, int currentRunIndex) {
        int runIndex = currentRunIndex;
        BoldRunsCollectorData boldRunsCollectorData = new BoldRunsCollectorData();
        boldRunsCollectorData.word = runs.get(currentRunIndex).getText(0).trim();

        while (runs.size() > runIndex + 1) {
            XWPFRun nextRun = runs.get(runIndex + 1);
            runIndex++;
            if (nextRun.isBold() ||
                    StringUtils.defaultIfBlank(nextRun.getText(0), StringUtils.EMPTY).isEmpty() ||
                    StringUtils.defaultIfBlank(nextRun.getText(0), StringUtils.EMPTY).contains("/")) {
                boldRunsCollectorData.word = boldRunsCollectorData.word + nextRun.getText(0);
            } else {
                break;
            }
        }

        boldRunsCollectorData.nextRunIndex = runIndex;
        return boldRunsCollectorData;
    }

    @Data
    private static class BoldRunsCollectorData {
        private String word;
        private int nextRunIndex;
    }

    protected abstract MorphologyCategoryResolver getMorphologyCategoryResolver();

    protected abstract MorphologyEndingsResolver getMorphologyEndingsResolver();
}
