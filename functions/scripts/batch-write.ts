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

const acknowledged = false;
if (!acknowledged) {
  console.error(WARNING_TEXT);
  throw 'Operation stopped. You have not acknowledged the warning.';
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const batch = db.batch();

let result;
let totalMatching = 0;
let notUpdated = 0;
let alreadyDone = 0;

(async () => {
  const snapshot = await db.collection(config.COLLECTION_NAME).get();

  result = util.snapshotToArray(snapshot);
  result.forEach(doc => {
    const ref = db.collection(config.COLLECTION_NAME).doc(doc.id);

    const sourceUrlIsManifesto =
      doc.source_url.indexOf(config.MANIFESTO_URL) > -1;
    const alreadyPartOfList =
      doc.list_ids && doc.list_ids.indexOf(config.MANIFESTO_LIST_ID) > -1;

    if (sourceUrlIsManifesto) {
      totalMatching++;
      if (alreadyPartOfList) {
        alreadyDone++;
      } else {
        const updateData = { list_ids: [config.MANIFESTO_LIST_ID] }; // update here
        batch.update(ref, updateData);

        notUpdated++;
      }
      if (doc.list_ids) console.log(doc.list_ids);
    }

    // WARNING: this line below alters the data
  });
  console.log({ totalMatching, notUpdated, alreadyDone });

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
