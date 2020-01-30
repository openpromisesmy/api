## Firebase Prerequisites

1.  Install Firebase CLI tool
    `npm i -g firebase-tools`
2.  Login via Firebase
    `firebase login` (you will be brought to your browser. login using the google account that has been given access to the project)
3.  Get Service Account Key
    refer to https://cloud.google.com/storage/docs/authentication#generating-a-private-key
    type of key = service account key
    choose 'App Engine Service Default' when prompted

## Up and Running

### Notes

API calls require a token and email in the header
(perhaps we should phase out needing the email in header as the decoded token might contain the email. TODO: check if decoded token contains email.)

### Steps

run `cd functions/`
run `npm i`
run `npm run tsc:watch` and leave terminal open
in a new terminal, run `npm run serve-h`
perform http query`GET localhost:5000/promises` with these headers set:

* `x-firebase-token`
* `x-firebase-email`
