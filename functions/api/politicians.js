const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const app = express();

app.use(cors({ origin: true }));

app.get('', (req, res) => {
  return res.send('OK');
});

app.get('/messages', (req, res) => {
  const db = admin.database()
  const ref = db.ref('/messages')

  ref.on('value', (snapshot) => {
    return res.send(snapshot.val())
  }, (errorObject) => {
    return res.send('The read failed', errorObject.code)
  });
});

// app.post('/', (req, res) => {
//   return admin.database()
//     .ref('/messages')
//     .push({foo: 'bar'})
//     .then((snapshot) => {
//       // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//       return res.redirect(303, snapshot.ref);
//     });
// })

module.exports = functions.https.onRequest(app);