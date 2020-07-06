import admin from 'firebase-admin';
// import * as functions from 'firebase-functions';

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  import serviceAccount = require('../secrets/google-key.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  // admin.initializeApp(functions.config().firebase);
  admin.initializeApp();
}

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;
