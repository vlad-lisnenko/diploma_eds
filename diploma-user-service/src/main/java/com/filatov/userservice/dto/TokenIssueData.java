package com.filatov.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "issued_tokens")
@NoArgsConstructor
@AllArgsConstructor
public class TokenIssueData {
    @Id
    private String id;

    @Indexed
    private String userEmail;

    @Indexed
    private Instant issueInstant;
    private Instant accessTokenExpirationInstant;
    private Instant refreshTokenExpirationInstant;

    public TokenIssueData(String userEmail, int accessExpireInSeconds, int refreshExpireInSeconds) {
        this.userEmail = userEmail;
        issueInstant = Instant.now();
        accessTokenExpirationInstant = issueInstant.plusSeconds(accessExpireInSeconds);
        refreshTokenExpirationInstant = issueInstant.plusSeconds(refreshExpireInSeconds);
    }
}
