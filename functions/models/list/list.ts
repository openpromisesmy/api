import admin from 'firebase-admin';

import util = require('../../etc/util');

import { IList } from '../../schemas/list';

async function list(
  query: any,
  dbOverride?: admin.firestore.Firestore
): Promise<object[]> {
  const db = dbOverride || admin.firestore();
  const snapshot = await filter(query, db).then(ref => ref.get());

  return util.snapshotToArray(snapshot);
}

async function filter(
  query: any,
  db: admin.firestore.Firestore
): Promise<admin.firestore.Query> {
  let queryChain: admin.firestore.Query = db.collection('lists');

  for (const prop in query) {
    switch (prop) {
      case 'live':
        queryChain = queryChain.where(prop, '==', query[prop]);
        break;
      default:
        break;
    }
  }

  return queryChain;
}

export default list;
