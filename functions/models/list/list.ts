import admin from 'firebase-admin';
import utils = require('../../etc/utils');
import _ from 'lodash';

type Query = { live?: boolean; reverse: boolean };
const list: Function = (db: admin.firestore.Firestore) => async (
  query: Query
): Promise<object[]> => {
  const collection = db.collection('lists');
  let ref = collection;
  if (!_.isEmpty(query)) {
    _.forIn(query, (value: any, key: string) => {
      switch (key) {
        case 'pageSize':
          ref = ref.limit(Number(value));
          break;
        case 'startAfter':
          ref = ref.startAfter(value);
          break;
        case 'orderBy':
          ref = ref.orderBy(value, query.reverse ? 'desc' : 'asc');
          break;
        case 'reverse':
          break;
        default:
          ref = ref.where(key, '==', value);
          break;
      }
    });
  }
  const snapshot = await ref.get();

  return utils.snapshotToArray(snapshot);
};

export default list;
