package com.app.dictionary.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Slf4j
public class WordUtils {
    public static List<String> ngram(int count, String string) {
        int start  = 0;
        int end = Math.min(count, string.length());
        List<String> result = new ArrayList<>();

        while (end <= string.length()) {
            result.add(string.substring(start, end));
            start++;
            end++;
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString("генераль".getBytes()));
        System.out.println(Arrays.toString("генераль".getBytes(StandardCharsets.UTF_8)));
    }

    public static String getNgramsForWord(String word) {
        if (word == null) {
            return null;
        }
        log.info("input: {}", word);
        String processedWord = word.replaceAll("(?U)[^\\p{Alpha}]", "");
        log.info("processedWord: {}", processedWord);
        if (processedWord.length() == 4) {
            return toNgramString(ngram(2, processedWord));
        } else if (processedWord.length() <= 10) {
            return toNgramString(ngram(3, processedWord));
        } else if (processedWord.length() <= 15) {
            return toNgramString(ngram(4, processedWord));
        } else {
            return toNgramString(ngram(5, processedWord));
        }
    }

    private static String toNgramString(List<String> list) {
        return String.join(" ", list);
    }
}
