const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const _ = require('lodash');

const promiseModel = require('../models/promise');

// promises.get('/')
// promises.post('/').json({ contributor_id: '123', politician_id: 'some id', source_date: '2018-03-03T16:20:01.072Z', source_name: 'Bernama', source_url: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md', cover_image: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md', category: 'potato', title: 'Promising promises', quote: '"...potato said potata"', status: 'In review' })
// promises.post('/--L6h7K0sYBhROj6wx2QZ').json({contributor_id:'321'})
// promises.get('/-L6grrLSYEBLbHIxpeGy')
// promises.delete('/-L6gfTkNClzZy7w9t_9e')

const promises = promiseModel();

const healthCheck = (req, res) => res.send('pong').end();

const createPromise = (req, res) =>
  promises.createSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);

    return promises
      .add(validatedData)
      .then(id => res.json(id))
      .catch(e => {
        console.log(e);
        return res.status(500).end();
      });
  });

const listPromises = (req, res) =>
  promises
    .list()
    .then(promises => res.json(promises))
    .catch(e => {
      console.log(e);
      return res.status(500).end();
    });

const getPromise = (req, res) =>
  promises
    .get(req.params.id)
    .then(
      Promise =>
        _.isEmpty(Promise) ? res.status(404).end() : res.json(Promise)
    )
    .catch(e => {
      console.log(e);
      return res.status(500).end();
    });

const updatePromise = (req, res) =>
  promises.updateSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);
    return promises
      .update(req.params.id, validatedData)
      .then(
        result =>
          result && result.status
            ? res.status(result.status).end()
            : res.status(204).end()
      )
      .catch(e => {
        console.log(e);
        return res.status(500).end();
      });
  });

const deletePromise = (req, res) =>
  promises
    .remove(req.params.id)
    .then(() => res.status(204).end())
    .catch(e => {
      console.log(e);
      return res.status(500).end();
    });

const app = express();

app.use(cors({ origin: true }));

app.get('/ping', healthCheck);

app.post('/', createPromise);

app.get('/', listPromises);

app.get('/:id', getPromise);

app.post('/:id', updatePromise);

app.delete('/:id', deletePromise);

module.exports = functions.https.onRequest(app);
