# Environment

1. rabbitmq.host
1. rabbitmq.port
1. email.sender.mail
1. email.sender.password
1. mail.host (ex. smtp.mailtrap.io)
1. mail.port (ex. 2525)
1. mail.transport.protocol (ex. smtp)
1. mail.smtp.auth (ex. true)
1. mail.smtp.starttls.enable (ex.true )
1. mail.debug (optional)

# Run locally

Set spring profiles active property to `dev`.

`gradlew clean bootRun`