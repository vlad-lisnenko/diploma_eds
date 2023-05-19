package com.filatov;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.filatov.model.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RabbitMqMessagesConsumer {
    @Value("${email.sender.mail}")
    private String senderEmail;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final MailSender mailSender;

    @RabbitListener(queues = "${email.queue.name}")
    public void listen(String message) {
        try {
            log.debug(message);
            Email email = objectMapper.readValue(message, Email.class);
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setTo(email.getTo());
            simpleMailMessage.setFrom(senderEmail);
            simpleMailMessage.setSubject(email.getSubject());
            simpleMailMessage.setText(email.getContent());
            mailSender.send(simpleMailMessage);
        } catch (Exception e) {
            log.error("Error while sending email", e);
        }
    }
}
