const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

function now () {
  return new Date().toISOString()
}

const politicianSchema = Joi.object().keys({
    contributor_id: Joi.string().required(),
    profile_image: Joi.string().required(),
    name: Joi.string().required(),
    primary_position: Joi.string().required(),
    brief: Joi.string().required(),
    description: Joi.string().optional(),
    status: Joi.string().required(),
    live: Joi.boolean().required(),
    created_at: Joi.date().iso().default(now, 'Time of creation'),
    updated_at: Joi.date().timestamp('javascript').default(now, 'Time of update')
})

// politicians.post('/').json({contributor_id: '123', profile_image: '123', name: 'Umar', primary_position: 'OpenPromises', brief: 'Umar bla bla', description: 'bla bla', status: 'verified', live: true})

function insertPolitician(data) {
  return admin.database()
    .ref('/politicians')
    .push(data)
}

const app = express();

app.use(cors({ origin: true }));

app.get('/ping', (req, res) => {
  return res.send('pong');
});

app.get('/', (req, res) => {
  const db = admin.database();
  const ref = db.ref('/politicians');

  ref.on('value', snapshot => {
    return res.send(snapshot.val());
  }, (errorObject) => {
    console.log('errorObject', errorObject);
    return res.status(500).end();
  });
});

app.post('/', (req, res) => {
  politicianSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);
    
    return insertPolitician(validatedData)
      .then(result => res.send(result))
      .catch(e => {
        console.log(e);
        return res.status(500).end();
      });
  });
});

module.exports = functions.https.onRequest(app);
