const admin = require('firebase-admin');
var serviceAccount = require('../secrets/google-key.json');
const util = require('../etc/util');

// WARNING
// DANGER!
// THIS SCRIPT WILL UPDATE ALL DOCUMENTS UNDER THE COLLECTION
// USE MINDFULLY
// TO ENABLE, CHANGE acknowledged to true
const acknowledged = false;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
var batch = db.batch();

const collectionName = '';
console.log(`batch writing ${collectionName}`);

let result;

db
  .collection(collectionName)
  .get()
  .then(snapshot => {
    if (!acknowledged) {
      return console.error(
        'Operation stopped. You have not acknowledged the warning.'
      );
    }

    result = util.snapshotToArray(snapshot);
    result.forEach(doc => {
      const ref = db.collection(collectionName).doc(doc.id);
      batch.update(ref, { live: true });
    });

    return batch.commit().then(function() {
      return console.log('done');
    });
  })
  .catch(e => reject(e));

// IF READING FROM JSON
// const json = require(`./${collectionName}`);
// for (let child in json) {
//   const id = child;
//   const object = json[id];
//   var ref = db.collection(collectionName).doc(id);
//   batch.set(ref, object);
// }
