import admin from 'firebase-admin';
import { IList } from '../../schemas/list';

// TODO: specify return Type
async function update(
  id: string,
  updateData: IList,
  dbOverride?: admin.firestore.Firestore
) {
  const db = dbOverride || admin.firestore();
  db.settings({ timestampsInSnapshots: true });
  const result = await db
    .collection('lists')
    .doc(id)
    .update(updateData);

  return result;
}

export default update;
