import cors from 'cors';
import express from 'express';
import admin from 'firebase-admin';
import _ from 'lodash';

import * as functions from 'firebase-functions';

import contributorModel from '../models/contributor';
import politicianModel from '../models/politician';
import PromiseModel from '../models/promise';

const contributors = contributorModel();
const politicians = politicianModel();

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
      contributors.stats(admin.firestore()),
      politicians.stats(),
      PromiseModel.stats()
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
