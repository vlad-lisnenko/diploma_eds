package com.filatov.userservice.controller;

import com.filatov.userservice.dto.ExceptionResponse;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class ExceptionResponseHandler {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatus()).body(new ExceptionResponse(e.getStatus().value(), e.getReason()));
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<Object> handleResponseStatusException() {
        return ResponseEntity.badRequest().body("Invalid token");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValidException() {
        return ResponseEntity.badRequest().body(new ExceptionResponse(HttpStatus.BAD_REQUEST.value(), "Invalid data"));
    }
}
