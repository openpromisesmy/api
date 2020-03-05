## Prerequisites

### SETUP FIREBASE

1.  Install Firebase CLI tool
    `npm i -g firebase-tools`
2.  Login via Firebase
    `firebase login` (you will be brought to your browser. login using the google account that has been given access to the project)

<del>3. Get Service Account Key
refer to https://cloud.google.com/storage/docs/authentication#generating-a-private-key
type of key = service account key
choose 'App Engine Service Default' when prompted</del>

### OBTAIN A SERVICE ACCOUNT KEY

* Request a senior Open Promises member to generate a service account key for you
* Place the key under `${OP_API_PROJECT_ROOT}/functions/secrets/google-key.json`, where `OP_API_PROJECT_ROOT` is your local path to the OP API repo.

###INSTALL THE GOOGLE CLOUD SDK

* Go to https://cloud.google.com/sdk/install
* Follow the instructions to install the Google Cloud SDK
* Run the following command in your terminal: `$ gcloud auth application-default login`

If you ignore this step, the OP API will throw an error: `Error: Could not load the default credentials.` whenever you send a request to it.

## Up and Running

### Notes

API calls require a token and email in the header
(perhaps we should phase out needing the email in header as the decoded token might contain the email. TODO: check if decoded token contains email.)

### Steps

GET YOUR FIREBASE TOKEN
go to openpromises.com
log out if already logged in
select "Sign in with Google
open network tab
look for the very last GET request that is to the path `?email=YOUR_EMAIL`
click on that request and check its headers
note the header item called `x-firebase-token`
copy the value
use this as the value for `x-firebase-token` in your API requests

RUN THE API SERVER

run `cd functions/`
run `npm i`
run `npm run tsc:watch` and leave terminal open
in a new terminal, run `npm run serve-h`
perform http query`GET localhost:5000/promises` with these headers set:

* `x-firebase-token`
* `x-firebase-email`
