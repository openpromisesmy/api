import admin from 'firebase-admin';

import { IList } from '../../schemas/list';

async function get(
  id: string,
  dbOverride?: admin.firestore.Firestore
): Promise<admin.firestore.DocumentData | undefined> {
  const db = dbOverride || admin.firestore();
  // db.settings({ timestampsInSnapshots: true });
  const snapshot = await db
    .collection('lists')
    .doc(id)
    .get();

  return snapshot.data();
}

export default get;
