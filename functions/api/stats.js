const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const _ = require('lodash');

const contributorModel = require('../models/contributor');
const politicianModel = require('../models/politician');
const promiseModel = require('../models/promise');

const { logger } = require('../etc/middlewares');

const contributors = contributorModel();
const politicians = politicianModel();
const promises = promiseModel();

// stats.get('/ping')
// stats.get('/general_stats')

const healthCheck = (req, res) => res.send('pong').end();

const generalStats = (req, res) => {
  Promise.all([contributors.stats(), politicians.stats(), promises.stats()])
    .then(result => res.json(buildGeneralStats(result)))
    .catch(e => {
      console.log(e);
      res.status(500).end();
    });
};

const app = express();

app.use(cors({ origin: true }));

app.get('/ping', healthCheck);

app.get('/general_stats', generalStats);

module.exports = functions.https.onRequest(app);

function buildGeneralStats(statsFromModels) {
  return statsFromModels.reduce((acc, stats, i) => {
    switch (i) {
      case 0:
        return Object.assign(acc, { contributors: stats });
      case 1:
        return Object.assign(acc, { politicians: stats });
      case 2:
        return Object.assign(acc, { promises: stats });
      default:
        return Object.assign(acc, stats);
    }
  }, {});
}
