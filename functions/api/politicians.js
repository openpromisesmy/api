const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");

const politicianModel = require("../models/politician");

// politicians.get('/')
// politicians.post('/').json({contributor_id: '123', profile_image: '123', name: 'Umar', primary_position: 'OpenPromises', brief: 'Umar bla bla', description: 'bla bla', status: 'verified', live: true})
// politicians.post('/-L6gfTkNClzZy7w9t_9e').json({contributor_id:'321'})
// politicians.get('/-L6grrLSYEBLbHIxpeGy')
// politicians.delete('/-L6gfTkNClzZy7w9t_9e')

const politicians = politicianModel();

const healthCheck = (req, res) => res.send("pong").end();

const createPolitician = (req, res) =>
  politicians.createSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);

    return politicians
      .add(validatedData)
      .then(id => res.json(id))
      .catch(e => res.status(500).end());
  });

const listPoliticans = (req, res) =>
  politicians
    .list()
    .then(politicians => res.json(politicians))
    .catch(e => res.status(500).send);

const getPolitician = (req, res) =>
  politicians
    .get(req.params.id)
    .then(
      politician =>
        _.isEmpty(politician) ? res.status(404).end() : res.json(politician)
    )
    .catch(e => res.status(500).end());

const updatePolitician = (req, res) =>
  politicians.updateSchema.validate(req.body, (err, validatedData) => {
    if (err) return res.status(400).send(err.message);
    return politicians
      .update(req.params.id, validatedData)
      .then(() => res.status(204).end())
      .catch(e => res.status(500).end());
  });

const deletePolitician = (req, res) =>
  politicians
    .remove(req.params.id)
    .then(() => res.status(204).end())
    .catch(e => res.status(500).end());

const app = express();

app.use(cors({ origin: true }));

app.get("/ping", (req, res) => res.send("pong").end());

app.post("/", createPolitician);

app.get("/", listPoliticans);

app.get("/:id", getPolitician);

app.post("/:id", updatePolitician);

app.delete("/:id", deletePolitician);

module.exports = functions.https.onRequest(app);
