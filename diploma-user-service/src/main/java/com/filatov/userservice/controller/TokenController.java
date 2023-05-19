package com.filatov.userservice.controller;

import com.filatov.userservice.dto.RefreshTokenRequest;
import com.filatov.userservice.dto.TokenSummaryRequest;
import com.filatov.userservice.model.Token;
import com.filatov.userservice.model.TokenSummary;
import com.filatov.userservice.model.TokenWithSummary;
import com.filatov.userservice.model.UserCredentials;
import com.filatov.userservice.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/token")
@RequiredArgsConstructor
public class TokenController {
    private final TokenService tokenService;

    @PostMapping("/summary")
    public ResponseEntity<TokenSummary> getTokenSummary(@RequestBody TokenSummaryRequest tokenSummaryRequest) {
        return ResponseEntity.ok(tokenService.createTokenSummary(tokenSummaryRequest.getToken()));
    }

    @PostMapping("/access-with-summary")
    public TokenWithSummary getTokenWithSummary(@RequestBody UserCredentials userCredentials) {
        log.debug("request for token from {}", userCredentials.getEmail());
        Optional<Token> token = tokenService.createTokenForCredentials(userCredentials);

        if (!token.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User email or password is invalid");
        }

        TokenSummary tokenSummary = tokenService.createTokenSummary(token.get().getAccessToken());
        return new TokenWithSummary(token.get(), tokenSummary);
    }

    @PostMapping("/access")
    public ResponseEntity<Token> getToken(@RequestBody UserCredentials credentials) {
        return ResponseEntity.of(tokenService.createTokenForCredentials(credentials));
    }

    @PostMapping("/refresh")
    public ResponseEntity<Token> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return ResponseEntity.of(tokenService.refreshToken(refreshTokenRequest.getRefreshToken()));
    }

    @PostMapping("/refresh-with-summary")
    public TokenWithSummary refreshTokenWithSummary(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        Optional<Token> token = tokenService.refreshToken(refreshTokenRequest.getRefreshToken());

        if (!token.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to refresh access token");
        }

        TokenSummary tokenSummary = tokenService.createTokenSummary(token.get().getAccessToken());
        return new TokenWithSummary(token.get(), tokenSummary);
    }
}
