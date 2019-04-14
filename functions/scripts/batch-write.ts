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

const WARNING_TEXT =
  ' \n WARNING!! \n\n run gcloud beta firestore export before running this \n\n DANGER!!! \n\n THIS SCRIPT WILL UPDATE ALL DOCUMENTS UNDER THE COLLECTION \n USE MINDFULLY \n TO ENABLE, CHANGE acknowledged to true';

const acknowledged = fale;
if (!acknowledged) {
  console.error(WARNING_TEXT);
  throw 'Operation stopped. You have not acknowledged the warning.';
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });
const batch = db.batch();

let result;
let totalMatching = 0;
let notUpdated = 0;
let alreadyDone = 0;

async function batchWrite() {
  const snapshot = await db.collection(config.COLLECTION_NAME).get();

  result = util.snapshotToArray(snapshot);
  result.forEach(doc => {
    const ref = db.collection(config.COLLECTION_NAME).doc(doc.id);

    const condition = null; // condition here

    if (condition) {
      const updateData = {}; // update here
      // WARNING: uncomment below
      // batch.update(ref, updateData);
    }
  });

  // WARNING: uncomment below to commit the change
  // await batch.commit();
}

batchWrite();

// IF READING FROM JSON
// const json = require(`./${COLLECTION_NAME}`);
// for (let child in json) {
//   const id = child;
//   const object = json[id];
//   var ref = db.collection(COLLECTION_NAME).doc(id);
//   batch.set(ref, object);
// }
