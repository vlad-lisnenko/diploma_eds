package com.filatov.model;

import lombok.Data;

@Data
public class Email {
    private String from;
    private String to;
    private String content;
    private String subject;
}
