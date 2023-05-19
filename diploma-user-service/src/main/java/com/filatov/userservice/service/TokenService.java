package com.filatov.userservice.service;

import com.filatov.userservice.model.Token;
import com.filatov.userservice.model.TokenSummary;
import com.filatov.userservice.model.UserCredentials;

import java.util.Optional;

public interface TokenService {
    Optional<Token> createTokenForCredentials(UserCredentials credentials);

    TokenSummary createTokenSummary(String token);

    Optional<Token> refreshToken(String refreshToken);
}
