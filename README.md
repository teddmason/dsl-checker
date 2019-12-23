#DSL-CHECKER

This is a small node application that schedules a hit on the bt dsl check website to check a telephone number's fibre availability at the cabinet.

It needs your number, a gmail account with less secure applications enabled, and an email account to receive the email that the status has changed.

Set up a free tier EC2 instance in AWS and clone this repo

`npm i`

Set the environment vars:

ENV VARS:

# FIBRE CHECKER
export DC_PHONE=
export DC_SENDEREMAIL=
export DC_SENDERPASSWORD=
export DC_RECEIVEEMAIL=

Then use pm2 to run headless.

If the status of the FTTC A or B changes from waiting list to something else it will email the recipient up to 5 times, and then proceed to log only if that number is hit.