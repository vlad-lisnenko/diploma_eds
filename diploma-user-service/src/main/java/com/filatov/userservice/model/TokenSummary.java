package com.filatov.userservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collections;
import java.util.List;

@Data
@AllArgsConstructor
public class TokenSummary {
    private Boolean expired;
    private Boolean valid;
    private String email;
    private List<String> userAuthorities;

    public static TokenSummary invalidTokenSummary() {
        return new TokenSummary(null, false, null, Collections.emptyList());
    }
}
