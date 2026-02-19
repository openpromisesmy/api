import admin from 'firebase-admin';

const isDev = process.env.NODE_ENV === 'development';

if (isDev && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;
