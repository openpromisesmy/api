import { IList } from '../../schemas/list';
import admin = require('firebase-admin');

const add: Function = (db: admin.firestore.Firestore) => async (
  record: IList
): Promise<{ id: string }> => {
  const ref = await db.collection('lists').add(record);

  return { id: ref.id };
};

export default add;
