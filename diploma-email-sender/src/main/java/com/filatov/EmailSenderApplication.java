package com.filatov;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@SpringBootApplication
@Slf4j
public class EmailSenderApplication {

    @Value("${email.queue.name}")
    private String emailQueueName;

    @Value("${email.topic.name}")
    private String emailTopicName;

    @Value("${email.routingKey}")
    private String emailRoutingKey;

    @Value("${email.sender.mail}")
    private String senderEmail;

    @Value("${email.sender.password}")
    private String emailSenderPassword;

    @Value("${mail.host}")
    private String mailHost;

    @Value("${mail.port}")
    private int port;

    @Value("${mail.transport.protocol}")
    private String protocol;

    @Value("${mail.smtp.auth}")
    private String auth;

    @Value("${mail.smtp.starttls.enable}")
    private String tls;

    @Value("${mail.debug:false}")
    private String debug;

    @Bean
    public Queue emailQueue() {
        log.info("Created queue {}", emailQueueName);
        return new Queue(emailQueueName);
    }

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(emailTopicName);
    }

    @Bean
    public Binding binding(Queue queue, TopicExchange topicExchange) {
        return BindingBuilder.bind(queue).to(topicExchange).with(emailRoutingKey);
    }

    @Bean
    public JavaMailSender mailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailHost);
        mailSender.setPort(port);

        mailSender.setUsername(senderEmail);
        mailSender.setPassword(emailSenderPassword);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", protocol);
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.starttls.enable", tls);
        props.put("mail.debug", debug);

        return mailSender;
    }

    public static void main(String[] args) {
        SpringApplication.run(EmailSenderApplication.class, args);

    }

}
