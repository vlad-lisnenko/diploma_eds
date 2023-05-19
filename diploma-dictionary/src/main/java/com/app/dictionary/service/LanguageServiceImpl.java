package com.app.dictionary.service;

import com.app.dictionary.dao.LanguageRepository;
import com.app.dictionary.model.Language;
import com.app.dictionary.util.MongoCollectionUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class LanguageServiceImpl implements LanguageService {
    private final LanguageRepository languageRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public List<Language> findAll() {
        return languageRepository.findAll();
    }

    @Override
    public Language save(Language language) {
        Optional<Language> savedLanguage = languageRepository.findByLanguage(language.getLanguage());
        if (savedLanguage.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Language already exists");
        }

        return languageRepository.save(language);
    }

    @Override
    public Language update(Language language) {
        Optional<Language> oldLanguage = languageRepository.findById(language.getId());
        if (!oldLanguage.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Language does not exist");
        }

        if (!oldLanguage.get().getLanguage().equalsIgnoreCase(language.getLanguage())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Language field update not allowed");
        }

        return languageRepository.save(language);
    }

    @Override
    public void deleteById(String id) {
        Optional<Language> language = languageRepository.findById(id);
        if (!language.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Language does not exists");
        }

        Set<String> collectionNames = mongoTemplate.getCollectionNames();
        boolean articleForLanguageArePresent = collectionNames.stream()
                .filter(it -> it.contains(MongoCollectionUtils.prepareLanguageForCollectionName(language.get().getLanguage())))
                .mapToLong(it -> mongoTemplate.count(new BasicQuery("{}"), it))
                .anyMatch(it -> it > 0);

        if (articleForLanguageArePresent) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Language has articles and cannot be deleted");
        }

        languageRepository.deleteById(id);
    }
}
