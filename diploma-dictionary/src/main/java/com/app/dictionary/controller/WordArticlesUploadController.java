package com.app.dictionary.controller;

import com.app.dictionary.dto.WordArticleLanguages;
import com.app.dictionary.service.WordArticleParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
public class WordArticlesUploadController {

    private final WordArticleParserService parserService;

    @PostMapping(value = "/pdf/{firstLanguage}/{secondLanguage}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void handleFileUpload(@PathVariable String firstLanguage, @PathVariable String secondLanguage, @RequestParam("file") MultipartFile file) throws IOException {
        parserService.parse(file, new WordArticleLanguages(firstLanguage, secondLanguage));
    }
}
