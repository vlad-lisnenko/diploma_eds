package com.filatov.userservice.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface UserDetailsService {
    UserDetails findDetailByEmail(String email);
}
