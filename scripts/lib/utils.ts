import { DocumentData, QuerySnapshot } from '@google-cloud/firestore';
import config from '../config';
import fs from 'fs';

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

function writeArrayToJsonFile(array, filepath) {
  fs.mkdir(config.READ.OUTPUT_DIR, { recursive: true }, err => {
    if (err) throw err;
    fs.writeFileSync(filepath, JSON.stringify(array));
    console.log(`Wrote to ${filepath}`);
  });
}

export = { snapshotToArray, writeArrayToJsonFile };
