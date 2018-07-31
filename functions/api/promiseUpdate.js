const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const _ = require('lodash');

const promiseUpdateModel = require('../models/promiseUpdate');

const promiseUpdates = promiseUpdateModel();

const healthCheck = (req, res) => res.send('pong').end();

const createPromiseUpdate = (req, res) =>
  promiseUpdates.createSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);

    return promiseUpdates
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

const listPromiseUpdates = (req, res) =>
  promiseUpdates
    .list(req.query)
    .then(
      result =>
        result.status
          ? res.status(result.status).json(result)
          : res.json(result)
    )
    .catch(e => {
      console.log(e);
      res.status(500).end();
    });

const getPromiseUpdate = (req, res) =>
  promiseUpdates
    .get(req.params.id)
    .then(
      promiseUpdate =>
        _.isEmpty(promiseUpdate)
          ? res.status(404).end()
          : res.json(promiseUpdate)
    )
    .catch(e => {
      console.log(e);
      res.status(500).end();
    });

const updatePromiseUpdate = (req, res) =>
  promiseUpdates.updateSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);
    return promiseUpdates
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

const deletePromiseUpdate = (req, res) =>
  promiseUpdates
    .remove(req.params.id)
    .then(() => res.status(204).end())
    .catch(e => {
      console.log(e);
      return res.status(500).end();
    });

const app = express();

app.use(cors({ origin: true }));

app.get('/ping', healthCheck);

app.post('/', createPromiseUpdate);
app.post('/:id', updatePromiseUpdate);
app.delete('/:id', deletePromiseUpdate);

app.get('/', listPromiseUpdates);
app.get('/:id', getPromiseUpdate);

module.exports = functions.https.onRequest(app);
