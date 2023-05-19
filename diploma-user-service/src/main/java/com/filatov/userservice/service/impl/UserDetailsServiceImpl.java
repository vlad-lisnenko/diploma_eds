package com.filatov.userservice.service.impl;

import com.filatov.userservice.model.UserDetailsImpl;
import com.filatov.userservice.service.UserDetailsService;
import com.filatov.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserService userService;

    @Override
    public UserDetails findDetailByEmail(String email) {
        return userService.findByEmail(email).map(UserDetailsImpl::new).orElse(null);
    }
}
