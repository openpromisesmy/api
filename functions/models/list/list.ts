import admin from 'firebase-admin';
import utils = require('../../etc/utils');
import _ from 'lodash';
import { RefHead } from '../types';

type Query = { live?: boolean; reverse: boolean };
const list: Function = (db: admin.firestore.Firestore) => async (
  query: Query
): Promise<object[]> => {
  const ref = db.collection('lists');
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
