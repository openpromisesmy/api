import _ from 'lodash';

import bodyParser from 'body-parser';
import boolParser from 'express-query-boolean';

import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';

import middlewares from '../etc/middlewares';
import PromiseModel from '../models/promise';

import { IPOptions, ValidationError } from 'joi';
import { IPromise } from '../schemas/promise';
import { limiter } from './ common';

const { firebaseAuth, routePermissions } = middlewares;

const app = express();

app.use(limiter);

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(boolParser());

app.get('/ping', healthCheck);

app.post('/', firebaseAuth, createPromise);
app.get('/all', firebaseAuth, routePermissions, listAllPromises);

app.post('/:id', firebaseAuth, updatePromise);
app.delete('/:id', firebaseAuth, deletePromise);

app.get('/', listPromises);
app.get('/:id', getPromise);

export = functions.https.onRequest(app);

function healthCheck(req: express.Request, res: express.Response) {
  return res.send('pong').end();
}

async function createPromise(req: express.Request, res: express.Response) {
  try {
    const validatedPromise = await _asyncPromiseValidateCreate(req.body);

    const promise = await PromiseModel.add(validatedPromise);

    return promise;
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send(e.message);
    }

    console.log(e);
    return res.status(500).end();
  }
}

// TODO: check for scope
// if no scope, call list with live:true
// if admin scope, call list with no arguments
// only live Promises shown
async function listPromises(req: express.Request, res: express.Response) {
  try {
    const promises = await PromiseModel.list({ live: true, ...req.query });

    return promises && res.json(promises);
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

// lists All Promises, for admin
async function listAllPromises(req: express.Request, res: express.Response) {
  try {
    const promises = await PromiseModel.list(req.query);

    return promises;
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

async function getPromise(req: express.Request, res: express.Response) {
  try {
    const promise = await PromiseModel.get(req.params.id);

    return _.isEmpty(promise) ? res.status(404).end() : res.json(promise);
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

async function updatePromise(req: express.Request, res: express.Response) {
  try {
    const validatedPromise = await _asyncPromiseValidateUpdate(req.body);

    const updatedPromise = await PromiseModel.update(
      req.params.id,
      validatedPromise
    );

    return updatedPromise && updatedPromise.status
      ? res.status(updatedPromise.status).json(updatedPromise)
      : res.status(204).end();
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send(e.message);
    }

    console.log(e);
    return res.status(500).end();
  }
}

async function deletePromise(req: express.Request, res: express.Response) {
  try {
    await PromiseModel.remove(req.params.id);

    return res.status(204).end();
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

function _asyncPromiseValidateCreate(
  dataToValidate: IPromise
): Promise<IPromise> {
  return new Promise((resolve, reject) => {
    PromiseModel.createSchema.validate(
      dataToValidate,
      (e: ValidationError, validatedData: IPromise) => {
        if (e) {
          return reject(e);
        }

        return resolve(validatedData);
      }
    );
  });
}

function _asyncPromiseValidateUpdate(dataToValidate: object) {
  return new Promise((resolve, reject) => {
    PromiseModel.updateSchema.validate(
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
