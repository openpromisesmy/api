import admin from 'firebase-admin';
import { IList } from '../../schemas/list';

// TODO: specify return Type
const update: Function = (db: admin.firestore.Firestore) => async (
  id: string,
  updateData: IList
) => {
  const result = await db
    .collection('lists')
    .doc(id)
    .update(updateData);

  return result;
};

export default update;
