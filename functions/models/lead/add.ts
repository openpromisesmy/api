import admin from 'firebase-admin';
import { ILead } from '../../schemas/lead';

async function add(
  record: ILead,
  dbOverride?: admin.firestore.Firestore
): Promise<{ id: string }> {
  const db = dbOverride || admin.firestore();
  const ref = await db.collection('leads').add(record);

  return { id: ref.id };
}

export default add;
