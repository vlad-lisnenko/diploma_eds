package com.app.dictionary.client.request;

import com.app.dictionary.model.UserAuthority;
import lombok.Data;

import java.util.List;

@Data
public class TokenSummary {
    private Boolean expired;
    private Boolean valid;
    private String email;
    private List<UserAuthority> userAuthorities;
}
