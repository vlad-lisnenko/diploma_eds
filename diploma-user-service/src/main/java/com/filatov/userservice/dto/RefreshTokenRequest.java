package com.filatov.userservice.dto;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
}
