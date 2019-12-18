import admin from 'firebase-admin';

const get: Function = (db: admin.firestore.Firestore) => async (
  id: string
): Promise<admin.firestore.DocumentData | undefined> => {
  const snapshot = await db
    .collection('lists')
    .doc(id)
    .get();

  return snapshot.data();
};

export default get;
