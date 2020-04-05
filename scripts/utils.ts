import { DocumentData, QuerySnapshot } from '@google-cloud/firestore';

const toObject = (id: string, fireObj: DocumentData): DocumentData => ({
  ...fireObj,
  id
});
const snapshotToArray = (snapshot: QuerySnapshot) => {
  const array: object[] = [];
  snapshot.forEach((doc: DocumentData) => {
    array.push(toObject(doc.id, doc.data()));
  });
  return array;
};

export = { snapshotToArray };
