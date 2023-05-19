package com.filatov.userservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.filatov.userservice.dto.EmailMessage;
import com.filatov.userservice.model.User;
import com.filatov.userservice.model.UserAuthority;
import com.filatov.userservice.model.UserCredentials;
import com.filatov.userservice.repository.TokenIssueDataRepository;
import com.filatov.userservice.repository.UserRepository;
import com.filatov.userservice.service.UserContainer;
import com.filatov.userservice.service.UserService;
import com.filatov.userservice.utils.PasswordUtils;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static java.util.Arrays.asList;
import static java.util.Collections.singleton;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Value("${email.topic.name}")
    private String emailTopicName;

    @Value("${email.routingKey}")
    private String emailRoutingKey;

    @Value("${root-admins:}")
    private Set<String> rootAdmins;
    private final UserRepository userRepository;
    private final UserContainer userContainer;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper mapper;
    private final TokenIssueDataRepository tokenIssueDataRepository;

    @SneakyThrows
    @Override
    public void create(User user) {
        Optional<User> userByEmail = userRepository.findByEmail(user.getEmail());

        if (userByEmail.isPresent()) {
            if (nonNull(userByEmail.get().getLastPasswordChanged())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with this email already registered");
            }
            user.setId(userByEmail.get().getId());
        }

        String randomPassword = RandomStringUtils.randomAlphanumeric(20);
        user.setPassword(PasswordUtils.encryptWithBcrypt(randomPassword));
        rabbitTemplate.convertAndSend(emailTopicName, emailRoutingKey, mapper.writeValueAsString(new EmailMessage(user.getEmail(), String.format("Your password %s", randomPassword), "Diploma admin password")));
        userRepository.save(user);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findByCredentials(UserCredentials credentials) {
        Optional<User> user = userRepository.findByEmail(credentials.getEmail());
        return user.map(it -> PasswordUtils.isValid(credentials.getPassword(), it.getPassword()) ? it : null);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void updatePassword(String oldPassword, String newPassword) {
        User user = userContainer.getUser();
        if (!PasswordUtils.isValid(oldPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid old password");
        }

        user.setPassword(PasswordUtils.encryptWithBcrypt(newPassword));
        if (isNull(user.getLastPasswordChanged())) {
            if (rootAdmins.contains(user.getEmail())) {
                user.setUserAuthorities(new LinkedHashSet<>(asList(UserAuthority.ALL, UserAuthority.ROOT)));
            } else {
                user.setUserAuthorities(singleton(UserAuthority.ALL));
            }
        } else if (rootAdmins.contains(user.getEmail())) {
            user.getUserAuthorities().add(UserAuthority.ROOT);
        }

        user.setLastPasswordChanged(LocalDateTime.now());

        tokenIssueDataRepository.removeByUserEmail(user.getEmail());
        userRepository.save(user);
    }

    @Override
    public void deleteById(String id) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User does not exists");
        }

        tokenIssueDataRepository.removeByUserEmail(user.get().getEmail());
        userRepository.deleteById(id);
    }
}
