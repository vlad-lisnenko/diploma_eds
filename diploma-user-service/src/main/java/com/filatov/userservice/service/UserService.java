package com.filatov.userservice.service;

import com.filatov.userservice.model.User;
import com.filatov.userservice.model.UserCredentials;

import java.util.List;
import java.util.Optional;

public interface UserService {
    void create(User user);

    List<User> findAll();

    Optional<User> findByCredentials(UserCredentials credentials);

    Optional<User> findByEmail(String email);

    void updatePassword(String oldPassword, String newPassword);

    void deleteById(String id);
}
