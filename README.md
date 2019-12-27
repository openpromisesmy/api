## Pre-requisites

1.  Firebase
    `npm i -g firebase-tools`
    `firebase login`
2.  Service Account Key
    refer to https://cloud.google.com/storage/docs/authentication#generating-a-private-key
    type of key = service account key
    choose 'App Engine Service Default' when prompted

export GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json

## Up and Running

run `cd functions/`
run `npm run tsc:watch` and leave terminal open
in a new terminal `npm run serve-h`
perform http query`GET localhost:5000/promises`
