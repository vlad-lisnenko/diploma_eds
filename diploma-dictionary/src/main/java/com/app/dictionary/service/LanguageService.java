package com.app.dictionary.service;

import com.app.dictionary.model.Language;

import java.util.List;

public interface LanguageService {
    List<Language> findAll();

    Language save(Language language);

    Language update(Language language);

    void deleteById(String id);
}
