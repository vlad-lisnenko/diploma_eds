FROM openjdk:8

COPY build/libs/user-service.jar user-service/user-service.jar

EXPOSE 8081

WORKDIR "/user-service"

ENTRYPOINT ["java", "-jar", "user-service.jar"]