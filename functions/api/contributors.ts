import cors from 'cors';
import express from 'express';
import admin from 'firebase-admin';
import _ from 'lodash';

import * as functions from 'firebase-functions';

import ContributorModel from '../models/contributor';

import { IContributor } from '../schemas/contributor';

import { ValidationError } from 'joi';

import middlewares from '../etc/middlewares';

import { limiter } from './ common';

const { firebaseAuth } = middlewares;

const contributorModel = ContributorModel();

const app = express();

app.use(limiter);

app.use(cors({ origin: true }));

app.get('/ping', healthCheck);

app.post('/', firebaseAuth, createContributor);
app.post('/:id', firebaseAuth, updateContributor);
app.delete('/:id', firebaseAuth, deleteContributor);

app.get('/', firebaseAuth, listContributors);
app.get('/:id', firebaseAuth, getContributor);

export = functions.https.onRequest(app);

function healthCheck(req: express.Request, res: express.Response) {
  return res.send('pong').end();
}

async function createContributor(req: express.Request, res: express.Response) {
  try {
    const validatedContributor = await _asyncContributorValidateCreate(
      req.body
    );

    const contributor = await contributorModel.add(
      validatedContributor,
      admin.firestore()
    );

    return contributor.id && res.status(200).json(contributor);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send(e.message);
    }

    console.log(e);
    return res.status(500).end();
  }
}

async function listContributors(req: express.Request, res: express.Response) {
  try {
    const contributors = await contributorModel.list(
      req.query,
      admin.firestore()
    );

    return res.json(contributors) || [];
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getContributor(req: express.Request, res: express.Response) {
  try {
    const contributor = await contributorModel.get(
      req.params.id,
      admin.firestore()
    );

    return _.isEmpty(contributor)
      ? res.status(404).end()
      : res.json(contributor);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function updateContributor(req: express.Request, res: express.Response) {
  try {
    const validatedContributor = await _asyncContributorValidateUpdate(
      req.body
    );

    const contributor = await contributorModel.update(
      req.params.id,
      validatedContributor,
      admin.firestore()
    );

    return contributor && res.status(204).end();
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send(e.message);
    }

    console.log(e);
    return res.status(500).end();
  }
}

async function deleteContributor(req: express.Request, res: express.Response) {
  try {
    await contributorModel.remove(req.params.id, admin.firestore());

    return res.status(204).end();
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

function _asyncContributorValidateCreate(dataToValidate: IContributor) {
  return new Promise<IContributor>((resolve, reject) => {
    contributorModel.createSchema.validate(
      dataToValidate,
      (e: ValidationError, validatedData: IContributor) => {
        if (e) {
          return reject(e);
        }

        return resolve(validatedData);
      }
    );
  });
}

function _asyncContributorValidateUpdate(dataToValidate: IContributor) {
  return new Promise<IContributor>((resolve, reject) => {
    contributorModel.updateSchema.validate(
      dataToValidate,
      (e: ValidationError, validatedData: IContributor) => {
        if (e) {
          return reject(e);
        }

        return resolve(validatedData);
      }
    );
  });
}
