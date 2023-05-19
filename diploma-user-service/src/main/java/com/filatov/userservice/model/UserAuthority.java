package com.filatov.userservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;

public enum UserAuthority implements GrantedAuthority {
    CHANGE_PASSWORD, ALL, ROOT;

    @Override
    @JsonIgnore
    public String getAuthority() {
        return toString();
    }
}
