package com.filatov.userservice.service.impl;

import com.filatov.userservice.repository.TokenIssueDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class DbCleanerService {
    private final TokenIssueDataRepository tokenIssueDataRepository;

    @Scheduled(cron = "0 5 * * * *")
    @EventListener(ApplicationStartedEvent.class)
    public void cleanExpiredTokens() {
        log.info("Cleaning tokens");
        tokenIssueDataRepository.removeByRefreshTokenExpirationInstantLessThan(Instant.now());
    }
}
