package com.filatov.userservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenWithSummary {
    private Token token;
    private TokenSummary tokenSummary;
}
