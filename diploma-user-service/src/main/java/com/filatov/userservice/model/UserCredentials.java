package com.filatov.userservice.model;

import lombok.Data;

@Data
public class UserCredentials {
    private String email;
    private String password;
}
