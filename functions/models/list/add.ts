import admin from 'firebase-admin';

import { IList } from '../../schemas/list';

async function add(
  record: IList,
  dbOverride?: admin.firestore.Firestore
): Promise<{ id: string }> {
  const db = dbOverride || admin.firestore();
  const ref = await db.collection('lists').add(record);

  return { id: ref.id };
}

export default add;
