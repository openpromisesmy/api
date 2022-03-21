import cors from 'cors';
import express from 'express';
import _ from 'lodash';

import * as functions from 'firebase-functions';

import PromiseUpdateModel from '../models/promiseUpdate';

import { ValidationError } from 'joi';

import middlewares from '../etc/middlewares';
import { IPromiseUpdate } from '../schemas/promiseUpdate';

import { limiter } from './ common';

const { firebaseAuth } = middlewares;

const promiseUpdateModel = PromiseUpdateModel();

const app = express();

app.use(limiter);

app.use(cors({ origin: true }));

app.get('/ping', healthCheck);

app.post('/', firebaseAuth, createPromiseUpdate);
app.post('/:id', firebaseAuth, updatePromiseUpdate);
app.delete('/:id', firebaseAuth, deletePromiseUpdate);

app.get('/all', listAllPromiseUpdates);
app.get('/', listPromiseUpdates);
app.get('/:id', getPromiseUpdate);

export = functions.https.onRequest(app);

function healthCheck(req: express.Request, res: express.Response) {
  return res.send('pong').end();
}

async function createPromiseUpdate(
  req: express.Request,
  res: express.Response
) {
  try {
    const validatedPromiseUpdate = await _asyncPromiseUpdateValidateCreate(
      req.body
    );

    const promiseUpdate = await promiseUpdateModel.add(validatedPromiseUpdate);

    return promiseUpdate && res.json(promiseUpdate);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send(e.message);
    }

    console.log(e);
    return res.status(500).end();
  }
}

async function listAllPromiseUpdates(
  req: express.Request,
  res: express.Response
) {
  try {
    const promiseUpdates = await promiseUpdateModel.list(req.query);

    return promiseUpdates;
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

async function listPromiseUpdates(req: express.Request, res: express.Response) {
  try {
    const promiseUpdates = await promiseUpdateModel.list({
      live: true,
      ...req.query
    });

    return promiseUpdates;
  } catch (e) {
    console.log(e);

    return res.status(500).end();
  }
}

async function getPromiseUpdate(req: express.Request, res: express.Response) {
  try {
    const promiseUpdate = await promiseUpdateModel.get(req.params.id);

    return _.isElement(promiseUpdate)
      ? res.status(404).end()
      : res.json(promiseUpdate);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function updatePromiseUpdate(
  req: express.Request,
  res: express.Response
) {
  try {
    const validatedPromiseUpdate = await _asyncPromiseUpdateValidateUpdate(
      req.body
    );

    const updatedPromise = await promiseUpdateModel.update(
      req.params.id,
      validatedPromiseUpdate
    );

    return updatedPromise && updatedPromise.status
      ? res.status(updatedPromise.status).json(updatedPromise)
      : res.status(204).end();
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send(e.message);
    }
  }
}

async function deletePromiseUpdate(
  req: express.Request,
  res: express.Response
) {
  try {
    await promiseUpdateModel.remove(req.params.id);

    return res.status(204).end();
  } catch (e) {
    console.log(e);

    return res.status(500).end();
  }
}

function _asyncPromiseUpdateValidateCreate(
  dataToValidate: IPromiseUpdate
): Promise<IPromiseUpdate> {
  return new Promise((resolve, reject) => {
    promiseUpdateModel.createSchema.validate(
      dataToValidate,
      (e: ValidationError, validatedData: IPromiseUpdate) => {
        if (e) {
          return reject(e);
        }

        return resolve(validatedData);
      }
    );
  });
}

function _asyncPromiseUpdateValidateUpdate(dataToValidate: object) {
  return new Promise((resolve, reject) => {
    promiseUpdateModel.updateSchema.validate(
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
