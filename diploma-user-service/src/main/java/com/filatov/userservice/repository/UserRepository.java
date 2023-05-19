package com.filatov.userservice.repository;

import com.filatov.userservice.model.User;
import com.filatov.userservice.model.UserAuthority;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    List<User> findByUserAuthoritiesContains(UserAuthority userAuthority);

    List<User> findByEmailIn(Set<String> emails);
}
