package com.filatov.userservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.filatov.userservice.views.Views;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;

@Data
@NoArgsConstructor
@Document(collection = "users")
@ToString(exclude = "password")
public class User {
    @Id
    @JsonView(Views.UserView.class)
    private String id;

    @Indexed(unique = true)
    @JsonView(Views.UserView.class)
    @Email
    @Size(max = 50)
    private String email;

    @JsonIgnore
    @Size(max = 50)
    private String password;

    private LocalDateTime lastPasswordChanged;
    private Set<UserAuthority> userAuthorities = Collections.singleton(UserAuthority.CHANGE_PASSWORD);

    public User(String email) {
        this.email = email;
    }
}
