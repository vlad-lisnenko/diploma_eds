# Environment

1. mongo.host
1. mongo.port
1. rabbitmq.host
1. rabbitmq.port
1. root-admins (optional) - comma separated list of emails
1. registry.host - eureka host
1. registry.port - eureka port

# Run locally

Set spring profiles active property to `dev`.

`gradlew clean bootRun`