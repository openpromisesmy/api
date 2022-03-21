import admin from 'firebase-admin';
const serviceAccount = require('../secret.json');

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  admin.initializeApp({ credential: admin.credential.cert(credentialPath) });
} else {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;
