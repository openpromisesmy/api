const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const _ = require('lodash');

const contributorModel = require('../models/contributor');

const { logger } = require('../etc/middlewares');

// contributors.get('/')
// contributors.post('/').json({ profile_image: 'https://assets.openpromises.com/DSCF8873.jpg', name: 'Umar Rasydan', email: 'umarrasydan@gmail.com', contact: '+60172562786', status: 'Admin', live: true })
// contributors.post('/-L6kq7u9sLz9fI2GuQ-h').json({name:'Umar Rasydan Romli'})
// contributors.get('/-L6kq7u9sLz9fI2GuQ-h')
// contributors.delete('/-L6gfTkNClzZy7w9t_9e')

const contributors = contributorModel();

const healthCheck = (req, res) => res.send('pong').end();

const createContributor = (req, res) =>
  contributors.createSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);

    return contributors
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

const listContributors = (req, res) =>
  contributors
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

const getContributor = (req, res) =>
  contributors
    .get(req.params.id)
    .then(
      contributor =>
        _.isEmpty(contributor) ? res.status(404).end() : res.json(contributor)
    )
    .catch(e => {
      console.log(e);
      res.status(500).end();
    });

const updateContributor = (req, res) =>
  contributors.updateSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);
    return contributors
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

const deleteContributor = (req, res) =>
  contributors
    .remove(req.params.id)
    .then(() => res.status(204).end())
    .catch(e => {
      console.log(e);
      return res.status(500).end();
    });

const app = express();

app.use(cors({ origin: true }));

app.get('/ping', healthCheck);

app.post('/', createContributor);
app.post('/:id', updateContributor);
app.delete('/:id', deleteContributor);

app.get('/', listContributors);
app.get('/:id', getContributor);

module.exports = functions.https.onRequest(app);
