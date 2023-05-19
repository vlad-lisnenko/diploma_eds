package com.app.dictionary.controller;

import com.app.dictionary.model.Language;
import com.app.dictionary.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/languages")
@RequiredArgsConstructor
public class LanguageController {
    private final LanguageService languageService;

    @GetMapping
    public List<Language> findAll() {
        return languageService.findAll();
    }

    @PostMapping
    public Language create(@RequestBody @Valid Language language) {
        return languageService.save(language);
    }

    @PutMapping("/{id}")
    public Language update(@RequestBody @Valid Language language, @PathVariable String id) {
        if (!Objects.equals(language.getId(), id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ids don't match");
        }

        return languageService.update(language);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        languageService.deleteById(id);
    }
}
