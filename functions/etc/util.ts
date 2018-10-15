import { DocumentData, QuerySnapshot } from '@google-cloud/firestore';
import _ from 'lodash';

const compose = (...fns: Array<((d: any) => any)>) => (x: ((d: any) => any)) =>
  fns.reduceRight((acc, fn) => fn(acc), x);
const now = () => new Date().toISOString();
const toArray = (fireObj: DocumentData) =>
  Object.keys(fireObj).reduce(
    (acc, key) => acc.concat({ ...fireObj[key], id: key }),
    []
  );
const toObject = (id: string, fireObj: DocumentData) => ({ ...fireObj, id });
const getKey = (obj: any) => Object.keys(obj)[0];
const getValue = (obj: any) => obj[getKey(obj)];
const snapshotToArray = (snapshot: QuerySnapshot) => {
  const array: object[] = [];
  snapshot.forEach((doc: DocumentData) => {
    array.push(toObject(doc.id, doc.data()));
  });
  return array;
};
const promisify = (f: any, ...params: any[]) => {
  return new Promise((resolve, reject) => {
    f(...params, (e: ErrorEvent, result: any) => {
      if (e) {
        return reject(e);
      }

      return resolve(result);
    });
  });
};

const parseQueryForRef = (ref, query) => {
  const paginationQueries = ['orderBy', 'reverse'];

  if (!_.isEmpty(query)) {
    for (let x in query) {
      if (paginationQueries.includes(x)) {
        // for pagination
        switch (x) {
          case 'orderBy':
            ref = ref.orderBy(query[x], query.reverse ? 'desc' : 'asc');
            break;
          default:
            break;
        }
      } else {
        // for other queries
        ref = ref.where(x, '==', query[x]);
      }
    }
  }

  return ref;
};

export = {
  compose,
  getKey,
  getValue,
  now,
  promisify,
  snapshotToArray,
  toArray,
  toObject,
  parseQueryForRef
};
