FROM openjdk:8

COPY build/libs/dictionary_parser.jar /dictionary_parser/dictionary_parser.jar

WORKDIR "/dictionary_parser"

EXPOSE 1111

ENTRYPOINT ["java", "-jar", "dictionary_parser.jar"]