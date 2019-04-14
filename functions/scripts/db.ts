import admin from 'firebase-admin';
import serviceAccount from './secret.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;
