package com.filatov.userservice.service.impl;

import com.filatov.userservice.model.User;
import com.filatov.userservice.model.UserDetailsImpl;
import com.filatov.userservice.service.UserContainer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserContainerImpl implements UserContainer {
    @Override
    public User getUser() {
        return ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser();
    }
}
