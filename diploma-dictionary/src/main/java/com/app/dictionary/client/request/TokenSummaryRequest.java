package com.app.dictionary.client.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenSummaryRequest {
    private String token;
}
