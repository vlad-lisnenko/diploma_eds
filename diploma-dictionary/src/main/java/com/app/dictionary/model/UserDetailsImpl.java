package com.app.dictionary.model;

import com.app.dictionary.client.request.TokenSummary;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {
    private TokenSummary tokenSummary;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return tokenSummary.getUserAuthorities();
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return tokenSummary.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
