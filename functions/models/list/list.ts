import admin from 'firebase-admin';

import util = require('../../etc/util');

import { IList } from '../../schemas/list';

async function list(
  query: object,
  dbOverride?: admin.firestore.Firestore
): Promise<object[]> {
  const db = dbOverride || admin.firestore();
  const snapshot = await db.collection('lists').get();

  return util.snapshotToArray(snapshot);
}

export default list;
