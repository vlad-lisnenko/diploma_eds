package com.filatov.userservice.configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Beans {
    @Value("${email.queue.name}")
    private String emailQueueName;

    @Value("${email.topic.name}")
    private String emailTopicName;

    @Value("${email.routingKey}")
    private String emailRoutingKey;

    @Bean
    public Queue emailQueue() {
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
}
