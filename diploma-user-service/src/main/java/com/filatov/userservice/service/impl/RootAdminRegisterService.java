package com.filatov.userservice.service.impl;

import com.filatov.userservice.model.User;
import com.filatov.userservice.model.UserAuthority;
import com.filatov.userservice.repository.UserRepository;
import com.filatov.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RootAdminRegisterService {

    @Value("${root-admins:}")
    private Set<String> rootAdmins;
    private final UserRepository userRepository;
    private final UserService userService;

    @EventListener(ApplicationStartedEvent.class)
    public void registerRootAdmins() {
        List<User> currentRootAdmins = userRepository.findByUserAuthoritiesContains(UserAuthority.ROOT);
        Set<String> currentRootAdminEmails = currentRootAdmins.stream().map(User::getEmail).collect(Collectors.toSet());
        log.info("current root admins: {}", currentRootAdminEmails);

        Set<String> removedAdmins = defineRemovedRootAuthority(currentRootAdminEmails);
        log.info("admins that lost root authority: {}", removedAdmins);

        Set<String> addedAdmins = defineAddedRootAuthority(currentRootAdminEmails);
        log.info("admins added to root list: {}", addedAdmins);

        List<User> adminsWithRemovedRootAuthority = removeRootAuthority(currentRootAdmins, removedAdmins);

        List<User> adminsByRootEmails = userRepository.findByEmailIn(rootAdmins);
        registerNewAdmins(adminsByRootEmails);

        List<User> newRootAdmins = addRootAuthority(adminsByRootEmails);
        log.info("admin that will get root authority: {}", newRootAdmins);

        List<User> usersToBeUpdated = new ArrayList<>(adminsWithRemovedRootAuthority);
        usersToBeUpdated.addAll(newRootAdmins);

        userRepository.saveAll(usersToBeUpdated);
    }

    private List<User> addRootAuthority(List<User> adminsByRootEmails) {
        List<User> newRootAdmins = adminsByRootEmails
                .stream()
                .filter(it -> !it.getUserAuthorities().contains(UserAuthority.CHANGE_PASSWORD) &&
                        !it.getUserAuthorities().contains(UserAuthority.ROOT))
                .peek(it -> it.getUserAuthorities().add(UserAuthority.ROOT))
                .collect(Collectors.toList());
        return newRootAdmins;
    }

    private List<User> removeRootAuthority(List<User> currentRootAdmins, Set<String> removedAdmins) {
        List<User> adminsWithRemovedRootAuthority = currentRootAdmins.stream()
                .filter(it -> removedAdmins.contains(it.getEmail()))
                .peek(it -> it.getUserAuthorities().remove(UserAuthority.ROOT))
                .collect(Collectors.toList());
        return adminsWithRemovedRootAuthority;
    }

    private Set<String> defineAddedRootAuthority(Set<String> currentRootAdminEmails) {
        return rootAdmins.stream()
                .filter(it -> !currentRootAdminEmails.contains(it))
                .collect(Collectors.toSet());
    }

    private Set<String> defineRemovedRootAuthority(Set<String> currentRootAdminEmails) {
        Set<String> removedAdmins = currentRootAdminEmails.stream()
                .filter(it -> !rootAdmins.contains(it))
                .collect(Collectors.toSet());
        return removedAdmins;
    }

    private void registerNewAdmins(List<User> adminsByRootEmails) {
        Set<String> registeredAdminRootEmails = adminsByRootEmails.stream().map(User::getEmail).collect(Collectors.toSet());
        Set<String> adminsToBeRegistered = rootAdmins.stream().filter(it -> !registeredAdminRootEmails.contains(it)).collect(Collectors.toSet());
        log.info("root admin that will be registered without root authority and receive it after password change: {}", adminsToBeRegistered);
        adminsToBeRegistered.forEach(it -> userService.create(new User(it)));
    }
}
