const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({ origin: true });
const _ = require('lodash');
const bodyParser = require('body-parser');
const boolParser = require('express-query-boolean');

const promiseModel = require('../models/promise');
const {
  firebaseAuth,
  logger,
  routePermissions
} = require('../etc/middlewares');

// promises.get('/')
// promises.post('/').json({ contributor_id: '123', politician_id: '-L5o5YwQa-jgdt_4sPqe', source_date: '2018-03-03T16:20:01.072Z', source_name: 'Bernama', source_url: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md', cover_image: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md', category: 'potato', title: 'Promising promises', quote: '"...potato said potata"', status: 'In review' })
// promises.post('/-L6kQKs6_GqlUfualdcA').json({contributor_id:'321'})
// promises.get('/-L6grrLSYEBLbHIxpeGy')
// promises.delete('/-L6gfTkNClzZy7w9t_9e')

const promises = promiseModel();

const healthCheck = (req, res) => res.send('pong').end();

const createPromise = (req, res) =>
  promises.createSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);

    return promises
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

// TODO: check for scope
// if no scope, call list with live:true
// if admin scope, call list with no arguments
// only live Promises shown
const listPromises = (req, res) =>
  promises
    .list({ live: true })
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

// lists All Promises, for admin
const listAllPromises = (req, res) =>
  promises
    .list()
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
            ? res.status(result.status).json(result)
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

app.use(cors);
app.use(bodyParser.json());
app.use(boolParser());

app.get('/ping', healthCheck);

app.post('/', firebaseAuth, createPromise);

app.get('/', listPromises);
app.get('/all', firebaseAuth, routePermissions, listAllPromises);

app.get('/:id', getPromise);

app.post('/:id', firebaseAuth, updatePromise);

app.delete('/:id', deletePromise);

module.exports = functions.https.onRequest(app);
