const admin = require('firebase-admin');
var serviceAccount = require('../secrets/google-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
var batch = db.batch();

const collectionName = 'politicians';
const json = require(`./${collectionName}`);

console.log(`batch writing ${collectionName}`);

for (let child in json) {
  const id = child;
  const object = json[id];
  var ref = db.collection(collectionName).doc(id);
  batch.set(ref, object);
}

batch.commit().then(function() {
  console.log('done');
});
