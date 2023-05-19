package com.filatov.userservice.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCrypt;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PasswordUtils {
    public static String encryptWithBcrypt(String plain) {
        return BCrypt.hashpw(plain, BCrypt.gensalt());
    }

    public static boolean isValid(String plain, String encrypted) {
        return BCrypt.checkpw(plain, encrypted);
    }
}
