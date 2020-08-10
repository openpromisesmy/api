import admin from 'firebase-admin';
import serviceAccount from '../secrets/google-key.json';
// import * as functions from 'firebase-functions';

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  // admin.initializeApp(functions.config().firebase);
  admin.initializeApp();
}

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;
