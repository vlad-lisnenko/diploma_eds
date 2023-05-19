FROM openjdk:8

COPY build/libs/api-gateway.jar /api-gateway/api-gateway.jar

WORKDIR /api-gateway

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "api-gateway.jar"]