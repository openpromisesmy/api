import admin from 'firebase-admin';
import util from '../etc/util';
import serviceAccount from './secret.json';

// WARNING
// DANGER!
// THIS SCRIPT WILL UPDATE ALL DOCUMENTS UNDER THE COLLECTION
// USE MINDFULLY
// TO ENABLE, CHANGE acknowledged to true
const acknowledged = false;
if (!acknowledged) {
  throw 'Operation stopped. You have not acknowledged the warning.';
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const batch = db.batch();

const collectionName = '';
console.log(`batch writing ${collectionName}`);

let result;

(async () => {
  const snapshot = await db.collection(collectionName).get();

  result = util.snapshotToArray(snapshot);
  result.forEach(doc => {
    const ref = db.collection(collectionName).doc(doc.id);
    batch.update(ref, { live: true });
  });

  await batch.commit();
})().catch(e => {
  console.log(e);
});

// IF READING FROM JSON
// const json = require(`./${collectionName}`);
// for (let child in json) {
//   const id = child;
//   const object = json[id];
//   var ref = db.collection(collectionName).doc(id);
//   batch.set(ref, object);
// }
