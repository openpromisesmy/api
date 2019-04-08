import admin from 'firebase-admin';
import util from '../etc/util';
import serviceAccount from './secret.json';

// define here
const config = {
  COLLECTION_NAME: 'promises',
  MANIFESTO_URL:
    'kempen.s3.amazonaws.com/manifesto/Manifesto_text/Manifesto_PH_EN.pdf',
  MANIFESTO_LIST_ID: 'YtIeJ0L72ged8cpKmJWx'
};

// WARNING
// DANGER!
// THIS SCRIPT WILL UPDATE ALL DOCUMENTS UNDER THE COLLECTION
// USE MINDFULLY
// TO ENABLE, CHANGE acknowledged to true
const acknowledged = true;
if (!acknowledged) {
  throw 'Operation stopped. You have not acknowledged the warning.';
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const batch = db.batch();

let result;
let counter = 0;

(async () => {
  const snapshot = await db.collection(config.COLLECTION_NAME).get();

  result = util.snapshotToArray(snapshot);
  result.forEach(doc => {
    const ref = db.collection(config.COLLECTION_NAME).doc(doc.id);
    const updateData = {}; // update here
    const sourceUrlIsManifesto =
      doc.source_url.indexOf(config.MANIFESTO_URL) > -1;
    if (sourceUrlIsManifesto) {
      if (doc.list_ids) console.log(doc.list_ids);
      counter++;
    }
    // WARNING: this line below alters the data
    // batch.update(ref, updateData);
  });
  console.log({ counter, result: result.length });

  // WARNING: uncomment below to commit the change
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
