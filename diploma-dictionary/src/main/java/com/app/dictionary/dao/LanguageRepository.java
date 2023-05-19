package com.app.dictionary.dao;

import com.app.dictionary.model.Language;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface LanguageRepository extends MongoRepository<Language, String> {
    Optional<Language> findByLanguage(String language);
}
