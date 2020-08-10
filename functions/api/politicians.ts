import cors from 'cors';

import * as functions from 'firebase-functions';

import express from 'express';
import _ from 'lodash';

import { firebaseAuth } from '../etc/middlewares';
import PoliticianModel from '../models/politician';

import { ValidationError } from 'joi';

// politicians.get('/')
// politicians.post('/').json({contributor_id: '123', profile_image: '123', name: 'Umar', primary_position: 'OpenPromises', brief: 'Umar bla bla', description: 'bla bla', status: 'verified', live: true})
// politicians.post('/-L6gfTkNClzZy7w9t_9e').json({contributor_id:'321'})
// politicians.get('/-L6grrLSYEBLbHIxpeGy')
// politicians.delete('/-L6gfTkNClzZy7w9t_9e')

const politicianModel = PoliticianModel();

const app = express();

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

    return politician;
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

    return politicians.status
      ? res.status(politicians.status).json(politicians)
      : res.json(politicians);
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

async function listAllPoliticians(req: express.Request, res: express.Response) {
  try {
    const politicians = await politicianModel.list(req.query);

    return politicians.status
      ? res.status(politicians.status).json(politicians)
      : res.json(politicians);
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

    const politician = await politicianModel.update(
      req.params.id,
      validatedPolitician
    );

    return politician && politician.status && res.status(204).end();
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

function _asyncPoliticianValidateCreate(dataToValidate: object) {
  return new Promise((resolve, reject) => {
    politicianModel.createSchema.validate(
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
