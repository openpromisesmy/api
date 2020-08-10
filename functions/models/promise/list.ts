import admin = require('firebase-admin');
import _ from 'lodash';
import utils from '../../etc/utils';
import { RefHead } from '../types';

interface IQuery {
  reverse?: boolean;
}

const list = (db: admin.firestore.Firestore) => async (query: IQuery) => {
  let ref = db.collection('promises');
  let head: RefHead = ref;
  if (!_.isEmpty(query)) {
    _.forIn(query, (value: any, key: string) => {
      switch (key) {
        case 'pageSize':
          head = head.limit(Number(value));
          break;
        case 'startAfter':
          head = head.startAfter(value);
          break;
        case 'orderBy':
          head = head.orderBy(value, query.reverse ? 'desc' : 'asc');
          break;
        case 'reverse':
          break;
        default:
          head = head.where(key, '==', value);
          break;
      }
    });
  }

  const snapshot = await head.get();
  return utils.snapshotToArray(snapshot);
};

export default list;
