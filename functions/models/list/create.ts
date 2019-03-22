import admin from 'firebase-admin';

import { IList } from '../../schemas/list';

async function create(
  data: IList,
  dbOverride?: admin.firestore.Firestore
): Promise<admin.firestore.DocumentData | undefined> {
  try {
    const db = dbOverride || admin.firestore();
    const ref = await db.collection('lists').add(data);

    return { id: ref.id };
  } catch (e) {
    throw e;
  }
}

export default create;
