import admin from 'firebase-admin';

import { IList } from '../../schemas/list';

async function create(
  data: IList,
  dbOverride?: admin.firestore.Firestore
): Promise<admin.firestore.DocumentData | undefined> {
  const db = dbOverride || admin.firestore();
  const ref = await db.collection('lists').add(data);

  if (!ref) {
    throw new Error('Fail to add');
  }

  return { id: ref.id };
}

export default create;
