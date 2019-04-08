import admin from 'firebase-admin';
import util from '../etc/util';
import serviceAccount from './secret.json';

// define here
const config = {
  COLLECTION_NAME: null
};

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

console.log(`batch writing ${config.COLLECTION_NAME}`);

let result;

(async () => {
  const snapshot = await db.collection(config.COLLECTION_NAME).get();

  result = util.snapshotToArray(snapshot);
  result.forEach(doc => {
    const ref = db.collection(config.COLLECTION_NAME).doc(doc.id);
    const updateData = {}; // update here
    console.log(doc.data());
    // batch.update(ref, updateData);
  });

  // await batch.commit();
})().catch(e => {
  console.log(e);
});

// IF READING FROM JSON
// const json = require(`./${COLLECTION_NAME}`);
// for (let child in json) {
//   const id = child;
//   const object = json[id];
//   var ref = db.collection(COLLECTION_NAME).doc(id);
//   batch.set(ref, object);
// }
