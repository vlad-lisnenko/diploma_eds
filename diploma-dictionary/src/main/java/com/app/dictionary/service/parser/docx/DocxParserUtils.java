package com.app.dictionary.service.parser.docx;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

import static java.util.Collections.singletonList;
import static org.apache.commons.lang3.StringUtils.defaultIfBlank;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class DocxParserUtils {

    private static final Pattern ALPHA_PATTERN = Pattern.compile("(?U)\\p{Alpha}+");
    private static final Pattern STARTS_WITH_DASH_PATTERN = Pattern.compile("^\\s*-.*");
    private static final Set<String> BOLD_STYLE_IDS = new HashSet<>(singletonList("af5"));

    public static boolean isWordParagraph(XWPFParagraph firstLanguageParagraph) {
        List<XWPFRun> runs = firstLanguageParagraph.getRuns();

        if (runs.size() < 1) {
            return false;
        }

        if (runs.size() > 1) {
            return (runs.get(0).isBold() && !startsWith(runs.get(0).getText(0))) ||
                    (defaultIfBlank(runs.get(0).getText(0), StringUtils.EMPTY).isEmpty() && runs.get(1).isBold());
        }
        return runs.get(0).isBold() && !runs.get(0).getText(0).isEmpty();
    }

    private static boolean startsWith(String text) {
        if (text == null) {
            return false;
        }
        return STARTS_WITH_DASH_PATTERN.matcher(text).find();
    }

    public static boolean isAlphaRun(XWPFRun run) {
        return Optional.ofNullable(run)
                .map(it -> it.getText(0))
                .map(it -> ALPHA_PATTERN.matcher(it).find())
                .orElse(false);
    }
}
