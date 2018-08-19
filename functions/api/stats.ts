import cors from 'cors';
import express from 'express';
import _ from 'lodash';

const functions = require('firebase-functions');

import contributorModel from '../models/contributor';
import politicianModel from '../models/politician';
import promiseModel from '../models/promise';

const contributors = contributorModel();
const politicians = politicianModel();
const promises = promiseModel();

// stats.get('/ping')
// stats.get('/general_stats')

const app = express();

app.use(cors({ origin: true }));
app.get('/ping', healthCheck);
app.get('/general_stats', generalStats);

export = functions.https.onRequest(app);

function healthCheck(req: express.Request, res: express.Response) {
  return res.send('pong').end();
}

async function generalStats(req: express.Request, res: express.Response) {
  try {
    const allStats = await Promise.all([
      contributors.stats(),
      politicians.stats(),
      promises.stats()
    ]);

    return res.json(_buildGeneralStats(allStats));
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

function _buildGeneralStats(statsFromModels: object[]) {
  return statsFromModels.reduce((acc: object, stats: object, i: number) => {
    switch (i) {
      case 0:
        return { ...acc, contributors: stats };
      case 1:
        return { ...acc, politicians: stats };
      case 2:
        return { ...acc, promises: stats };
      default:
        return { ...acc, ...stats };
    }
  }, {});
}
