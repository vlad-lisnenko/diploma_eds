package com.app.dictionary.controller;

import com.app.dictionary.dto.ExceptionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class ErrorResponseMapper {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ExceptionResponse> handleResponseStatusException(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatus()).body(new ExceptionResponse(exception.getStatus().value(), exception.getReason()));
    }
}
