package com.filatov.userservice.repository;

import com.filatov.userservice.dto.TokenIssueData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;

public interface TokenIssueDataRepository extends MongoRepository<TokenIssueData, String> {
    void removeByRefreshTokenExpirationInstantLessThan(Instant now);

    void removeByUserEmail(String email);
}
