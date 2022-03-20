## Prerequisites

### Firebase

0.  Create project on Firebase - [reference](https://docs.kii.com/en/samples/push-notifications/push-notifications-android-fcm/create-project/)
1.  Install the Firebase CLI tool:
    `npm i -g firebase-tools` [firebase cli doc](https://firebase.google.com/docs/cli) (you might need to sudo)
1.  Log in via the Firebase CLI tool:
    `firebase login`. You will be brought to your browser. Log in using the Google account which has been given access to the project.

#### OBTAIN THE SERVICE ACCOUNT KEY

* On Firebase, generate a service account if it has not been created.
* Place the key under `${PROJECT_ROOT}/functions/secrets/google-key.json`, where `PROJECT_ROOT` is your local path to the OpenPromises API repo.

#### INSTALL THE GOOGLE CLOUD SDK

* Go to https://cloud.google.com/sdk/install
* Follow the instructions to install the Google Cloud SDK (install it in your home directory)
* Run the init command as mentioned in the install instructions: `./google-cloud-sdk/bin/gcloud init` (it should have asked you to login and select the project)

If you ignore this step, the OP API will throw an error: `Error: Could not load the default credentials.` whenever you send a request to it.

## Up and Running

API calls require a token and email in the header
(perhaps we should phase out needing the email in header as the decoded token might contain the email. TODO: check if decoded token contains email.)

### 1. GET YOUR FIREBASE TOKEN

* Go to: `https://www.openpromises.com/`
* Log out if you are already logged in
* Open the Browser dev tools and go to the Network tab. You will need this because you will extract the token from the response headers after you sign in.
* Select "Sign in with Google" to sign in with your Google account
* In the Network tab, look for the GET request with the path of: `?email=YOUR_EMAIL`. Usually it's the very last entry in the list.
* Click on the entry and inspect the headers. You need the header called `x-firebase-token`.
* Use the value for the `x-firebase-token` header in your requests to the OpenPromises API

### 2. RUN THE API SERVER

* Run `cd functions/`
* Run `npm ci` (do `ci` over `i` whenever possible to not modify the lockfile unintentionally)
* Run `npm run tsc:watch` and leave the terminal open
* In a new terminal (also in `/functions`), run `npm run serve`
  (if you run into `Error: Port 5000 is not open on localhost, could not start functions emulator.`, find out what is already running on port 5000 and kill it) (on unix systems, run `lsof -t -i tcp:5000` to see what is running on port 5000) (in MacOS Monterrey, port 5000 might be used by AirPlay receiver, switch it off [reference image](https://i.stack.imgur.com/jlt4g.png) )
* When the `npm run serve` command is done, it will output the list of the OpenPromises API's endpoints.

### 3. DONE!

At this point you can send requests to the OpenPromises endpoints from the list. Please make sure to set the `x-firebase-token` and `x-firebase-email` headers for every request.
