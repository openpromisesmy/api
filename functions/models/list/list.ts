import admin from 'firebase-admin';
import utils = require('../../etc/utils');
import { IList } from '../../schemas/list';

type Params = { live?: boolean };

async function list(
  params: Params,
  dbOverride?: admin.firestore.Firestore
): Promise<object[]> {
  const db = dbOverride || admin.firestore();
  db.settings({ timestampsInSnapshots: true });
  const ref = await filter(db.collection('lists'), params, db);
  const snapshot = await ref.get();

  return utils.snapshotToArray(snapshot);
}

async function filter(
  query: admin.firestore.Query,
  params: Params,
  db: admin.firestore.Firestore
): Promise<admin.firestore.Query> {
  let result = query;

  for (const prop in params) {
    switch (prop) {
      case 'live':
        result = result.where(prop, '==', params[prop]);
        break;
      default:
        break;
    }
  }

  return result;
}

export default list;
