package com.filatov.userservice.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.filatov.userservice.dto.UpdatePasswordRequest;
import com.filatov.userservice.model.User;
import com.filatov.userservice.service.UserService;
import com.filatov.userservice.views.Views;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    @JsonView(Views.UserView.class)
    public List<User> findAll() {
        return userService.findAll();
    }

    @PostMapping
    public void create(@RequestBody @Valid User user) {
        userService.create(user);
    }

    @PatchMapping("/password")
    public void updatePassword(@RequestBody UpdatePasswordRequest updatePasswordRequest) {
        userService.updatePassword(updatePasswordRequest.getOldPassword(), updatePasswordRequest.getNewPassword());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        userService.deleteById(id);
    }
}
