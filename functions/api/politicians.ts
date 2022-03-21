import cors from 'cors';

import * as functions from 'firebase-functions';

import express from 'express';
import _ from 'lodash';

import { firebaseAuth } from '../etc/middlewares';
import PoliticianModel from '../models/politician';

import { IpOptions, ValidationError } from 'joi';
import { IPolitician } from '../schemas/politician';

import rateLimit from 'express-rate-limit';

const politicianModel = PoliticianModel();

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1
});
app.use(limiter);

app.use(cors({ origin: true }));

app.get('/ping', healthCheck);

app.post('/', firebaseAuth, createPolitician);
app.post('/:id', firebaseAuth, updatePolitician);
app.delete('/:id', firebaseAuth, deletePolitician);

app.get('/', listPoliticians);
app.get('/all', listAllPoliticians);
app.get('/:id', getPolitician);

export = functions.https.onRequest(app);

function healthCheck(req: express.Request, res: express.Response) {
  return res.send('pong').end();
}

async function createPolitician(req: express.Request, res: express.Response) {
  try {
    const validatedPolitician = await _asyncPoliticianValidateCreate(req.body);

    const politician = await politicianModel.add(validatedPolitician);

    return res.json(politician);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send(e.message);
    }

    console.log(e);
    return res.status(500).end();
  }
}

async function listPoliticians(req: express.Request, res: express.Response) {
  try {
    const politicians = await politicianModel.list({
      live: true,
      ...req.query
    });

    return res.json(politicians);
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

async function listAllPoliticians(req: express.Request, res: express.Response) {
  try {
    const politicians = await politicianModel.list(req.query);

    return politicians && res.json(politicians);
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

async function getPolitician(req: express.Request, res: express.Response) {
  try {
    const politician = await politicianModel.get(req.params.id);

    return _.isEmpty(politician) ? res.status(404).end() : res.json(politician);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function updatePolitician(req: express.Request, res: express.Response) {
  try {
    const validatedPolitician = await _asyncPoliticianValidateUpdate(req.body);
    // TODO: we need to handle when politician is updated from live to not live, all their promises needs to be made not live too
    const politician = await politicianModel.update(
      req.params.id,
      validatedPolitician
    );

    return politician && res.status(204).end();
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send(e.message);
    }

    console.log(e);
    return res.status(500).end();
  }
}

async function deletePolitician(req: express.Request, res: express.Response) {
  try {
    await politicianModel.remove(req.params.id);

    return res.status(204).end();
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

function _asyncPoliticianValidateCreate(
  dataToValidate: IPolitician
): Promise<IPolitician> {
  return new Promise((resolve, reject) => {
    politicianModel.createSchema.validate(
      dataToValidate,
      (e: ValidationError, validatedData: IPolitician) => {
        if (e) {
          return reject(e);
        }

        return resolve(validatedData);
      }
    );
  });
}

function _asyncPoliticianValidateUpdate(dataToValidate: object) {
  return new Promise((resolve, reject) => {
    politicianModel.updateSchema.validate(
      dataToValidate,
      (e: ValidationError, validatedData: object) => {
        if (e) {
          return reject(e);
        }

        return resolve(validatedData);
      }
    );
  });
}
