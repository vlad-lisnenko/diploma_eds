FROM openjdk:8

COPY build/libs/service-registry.jar service-registry/service-registry.jar

WORKDIR "/service-registry"

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "service-registry.jar"]