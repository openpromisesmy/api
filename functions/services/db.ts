import admin from 'firebase-admin';
/* tslint:disable-next-line */
const credentialPath = require('../secrets/google-key.json');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  admin.initializeApp({ credential: admin.credential.cert(credentialPath) });
} else {
  admin.initializeApp();
}

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;
