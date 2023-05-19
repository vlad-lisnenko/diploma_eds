package com.filatov.userservice.service.impl;

import com.filatov.userservice.constants.JwtClaims;
import com.filatov.userservice.dto.TokenIssueData;
import com.filatov.userservice.model.Token;
import com.filatov.userservice.model.TokenSummary;
import com.filatov.userservice.model.User;
import com.filatov.userservice.model.UserCredentials;
import com.filatov.userservice.repository.TokenIssueDataRepository;
import com.filatov.userservice.service.TokenService;
import com.filatov.userservice.service.UserService;
import io.jsonwebtoken.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final UserService userService;
    private final TokenIssueDataRepository tokenIssueDataRepository;
    private final JwtUtil jwtUtil;

    @Value("${token.expiration}")
    private int accessTokenExpiration;

    @Value("${token.refresh.expiration}")
    private int refreshTokenExpiration;

    @Override
    public Optional<Token> createTokenForCredentials(UserCredentials credentials) {
        Optional<User> user = userService.findByCredentials(credentials);
        if (!user.isPresent()) {
            log.debug("user with email [{}] is not present in db or password is invalid", credentials.getEmail());
            return Optional.empty();
        }
        Instant tokenIssueInstant = Instant.now();
        Instant accessTokenExpirationInstant = tokenIssueInstant.plusSeconds(accessTokenExpiration);
        Instant refreshTokenExpirationInstant = tokenIssueInstant.plusSeconds(refreshTokenExpiration);

        TokenIssueData tokenIssueData = new TokenIssueData(null, user.get().getEmail(), tokenIssueInstant, accessTokenExpirationInstant, refreshTokenExpirationInstant);
        TokenIssueData savedTokenIssueData = tokenIssueDataRepository.save(tokenIssueData);

        return user.map(it -> mapUserToJwt(it, savedTokenIssueData));
    }

    @Override
    public TokenSummary createTokenSummary(String token) {
        try {
            String email = jwtUtil.extractAccessClaim(token, claims -> claims.get(JwtClaims.EMAIL, String.class));
            String tokenId = jwtUtil.extractAccessClaim(token, claims -> claims.get(JwtClaims.TOKEN_ID, String.class));

            Optional<TokenIssueData> tokenIssueData = tokenIssueDataRepository.findById(tokenId);

            if (!tokenIssueData.isPresent()) {
                return TokenSummary.invalidTokenSummary();
            }

            boolean isExpired = tokenIssueData.get().getAccessTokenExpirationInstant().isBefore(Instant.now());
            List userAuthorities = jwtUtil.extractAccessClaim(token, claims -> claims.get(JwtClaims.AUTHORITIES, List.class));

            return new TokenSummary(isExpired, true, email, userAuthorities);
        } catch (SignatureException e) {
            return TokenSummary.invalidTokenSummary();
        }
    }

    @Override
    public Optional<Token> refreshToken(String refreshToken) {
        try {
            if (jwtUtil.isRefreshNotExpired(refreshToken)) {
                String tokenId = jwtUtil.extractRefreshClaim(refreshToken, claims -> claims.get(JwtClaims.TOKEN_ID, String.class));
                String email = jwtUtil.extractRefreshClaim(refreshToken, claims -> claims.get(JwtClaims.EMAIL, String.class));

                Optional<User> user = userService.findByEmail(email);
                TokenIssueData tokenIssueData =
                        tokenIssueDataRepository.findById(tokenId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid refresh token"));

                if (tokenIssueData.getRefreshTokenExpirationInstant().isBefore(Instant.now())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh token is expired");
                }

                tokenIssueDataRepository.deleteById(tokenId);

                TokenIssueData savedTokenData = tokenIssueDataRepository.save(new TokenIssueData(email, accessTokenExpiration, refreshTokenExpiration));

                return user.map(it -> mapUserToJwt(it, savedTokenData));
            }
        } catch (SignatureException e) {
            log.error("can't parse token", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid refresh token");
        }
        return Optional.empty();
    }

    private Token mapUserToJwt(User user, TokenIssueData tokenIssueData) {
        return Token.builder()
                .accessToken(jwtUtil.createToken(user, tokenIssueData))
                .refreshToken(jwtUtil.createRefreshToken(user, tokenIssueData))
                .expiresIn(accessTokenExpiration)
                .refreshExpiresIn(refreshTokenExpiration)
                .build();
    }
}
