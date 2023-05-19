package com.filatov.userservice.service.impl;

import com.filatov.userservice.constants.JwtClaims;
import com.filatov.userservice.dto.TokenIssueData;
import com.filatov.userservice.model.User;
import com.filatov.userservice.model.UserAuthority;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {
    private static final long DAYS_TO_PARSE_TOKEN = TimeUnit.DAYS.toSeconds(30);
    @Value("${token.sign.key}")
    private String tokenSignKey;

    @Value("${token.refresh.sign.key}")
    private String refreshTokenSignKey;

    @SneakyThrows
    public String createToken(User user, TokenIssueData tokenIssueData) {
        String email = user.getEmail();
        Claims claims = Jwts.claims();
        Set<UserAuthority> userAuthorities = user.getUserAuthorities();

        claims.put(JwtClaims.EMAIL, email);
        claims.put(JwtClaims.TOKEN_ID, tokenIssueData.getId());
        claims.put(JwtClaims.AUTHORITIES, userAuthorities);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(Date.from(tokenIssueData.getIssueInstant()))
                .setExpiration(Date.from(tokenIssueData.getAccessTokenExpirationInstant()))
                .signWith(SignatureAlgorithm.HS256, tokenSignKey)
                .compact();
    }

    public String createRefreshToken(User user, TokenIssueData tokenIssueData) {
        Claims claims = Jwts.claims();
        claims.put(JwtClaims.EMAIL, user.getEmail());
        claims.put(JwtClaims.TOKEN_ID, tokenIssueData.getId());

        return Jwts.builder()
                .setSubject(user.getEmail())
                .setClaims(claims)
                .setIssuedAt(Date.from(tokenIssueData.getIssueInstant()))
                .setExpiration(Date.from(tokenIssueData.getRefreshTokenExpirationInstant()))
                .signWith(SignatureAlgorithm.HS256, refreshTokenSignKey)
                .compact();
    }

    public <U> U extractClaim(String token, String signKey, Function<Claims, U> claimExtractor) {
        Claims claims = extractClaims(token, signKey);
        return claimExtractor.apply(claims);
    }

    public <U> U extractAccessClaim(String token, Function<Claims, U> claimExtractor) {
        return extractClaim(token, tokenSignKey, claimExtractor);
    }

    public <U> U extractRefreshClaim(String token, Function<Claims, U> claimExtractor) {
        return extractClaim(token, refreshTokenSignKey, claimExtractor);
    }

    public boolean isAccessTokenNotExpired(String token) {
        return isTokenNotExpired(token, tokenSignKey);
    }

    public boolean isRefreshNotExpired(String token) {
        return isTokenNotExpired(token, refreshTokenSignKey);
    }

    private boolean isTokenNotExpired(String token, String tokenKey) {
        Date expiration = extractClaim(token, tokenKey, Claims::getExpiration);
        return Date.from(Instant.now()).before(expiration);
    }

    public Claims extractAccessClaims(String token) {
        return extractClaims(token, tokenSignKey);
    }

    public Claims extractRefreshClaims(String token) {
        return extractClaims(token, refreshTokenSignKey);
    }

    public Claims extractClaims(String token, String signKey) {
        return Jwts.parser()
                .setSigningKey(signKey)
                .setAllowedClockSkewSeconds(DAYS_TO_PARSE_TOKEN)
                .parseClaimsJws(token)
                .getBody();
    }
}

