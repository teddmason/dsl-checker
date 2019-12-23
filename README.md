#DSL-CHECKER

This is a small node application that schedules a hit on the bt dsl check website to check a telephone number's fibre availability at the cabinet.

It needs your number, a gmail account with less secure applications enabled, and an email account to receive the email that the status has changed.

ENV VARS:

# FIBRE CHECKER
export DC_PHONE=
export DC_SENDEREMAIL=
export DC_SENDERPASSWORD=
export DC_RECEIVEEMAIL=