package com.filatov.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailMessage {
    private String to;
    private String content;
    private String subject;
}
