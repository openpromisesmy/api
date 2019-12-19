import admin = require('firebase-admin');
import _ from 'lodash';
import utils from '../../etc/utils';

const list = (db: admin.firestore.Firestore) => async (query: object) => {
  let ref = db.collection('promises');
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
