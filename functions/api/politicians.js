const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const _ = require('lodash');

const politicianModel = require('../models/politician');

// politicians.get('/')
// politicians.post('/').json({contributor_id: '123', profile_image: '123', name: 'Umar', primary_position: 'OpenPromises', brief: 'Umar bla bla', description: 'bla bla', status: 'verified', live: true})
// politicians.post('/-L6gfTkNClzZy7w9t_9e').json({contributor_id:'321'})
// politicians.get('/-L6grrLSYEBLbHIxpeGy')
// politicians.delete('/-L6gfTkNClzZy7w9t_9e')

const politicians = politicianModel();

const healthCheck = (req, res) => res.send('pong').end();

const createPolitician = (req, res) =>
  politicians.createSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);

    return politicians
      .add(validatedData)
      .then(
        result =>
          result.status
            ? res.status(result.status).json(result)
            : res.json(result)
      )
      .catch(e => {
        console.log(e);
        return res.status(500).end();
      });
  });

const listPoliticians = (req, res) =>
  politicians
    .list(Object.assign({ live: true }, req.query))
    .then(
      result =>
        result.status
          ? res.status(result.status).json(result)
          : res.json(result)
    )
    .catch(e => {
      console.log(e);
      return res.status(500).end();
    });

const getPolitician = (req, res) =>
  politicians
    .get(req.params.id)
    .then(
      politician =>
        _.isEmpty(politician) ? res.status(404).end() : res.json(politician)
    )
    .catch(e => {
      console.log(e);
      res.status(500).end();
    });

const updatePolitician = (req, res) =>
  politicians.updateSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);
    return politicians
      .update(req.params.id, validatedData)
      .then(
        result =>
          result && result.status
            ? res.status(result.status).json(result)
            : res.status(204).end()
      )
      .catch(e => {
        console.log(e);
        return res.status(500).end();
      });
  });

const deletePolitician = (req, res) =>
  politicians
    .remove(req.params.id)
    .then(() => res.status(204).end())
    .catch(e => {
      console.log(e);
      return res.status(500).end();
    });

const app = express();

app.use(cors({ origin: true }));

app.get('/ping', healthCheck);

app.post('/', createPolitician);

app.get('/', listPoliticians);

app.get('/:id', getPolitician);

app.post('/:id', updatePolitician);

app.delete('/:id', deletePolitician);

module.exports = functions.https.onRequest(app);
