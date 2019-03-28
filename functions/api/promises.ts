import _ from 'lodash';

import bodyParser from 'body-parser';
import boolParser from 'express-query-boolean';

import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';

import middlewares from '../etc/middlewares';
import PromiseModel from '../models/promise';

import { ValidationError } from 'joi';

const { firebaseAuth, routePermissions } = middlewares;
// promises.get('/')
// promises.post('/').json({ contributor_id: '123', politician_id: '-L5o5YwQa-jgdt_4sPqe', source_date: '2018-03-03T16:20:01.072Z', source_name: 'Bernama', source_url: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md', cover_image: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md', category: 'potato', title: 'Promising promises', quote: '"...potato said potata"', status: 'In review' })
// promises.post('/-L6kQKs6_GqlUfualdcA').json({contributor_id:'321'})
// promises.get('/-L6grrLSYEBLbHIxpeGy')
// promises.delete('/-L6gfTkNClzZy7w9t_9e')

const app = express();

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

    return promise.status
      ? res.status(promise.status).json(promise)
      : res.json(promise);
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

    return promises.status
      ? res.status(promises.status).json(promises)
      : res.json(promises);
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

// lists All Promises, for admin
async function listAllPromises(req: express.Request, res: express.Response) {
  try {
    const promises = await PromiseModel.list(req.query);

    return promises.status
      ? res.status(promises.status).json(promises)
      : res.json(promises);
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

function _asyncPromiseValidateCreate(dataToValidate: object) {
  return new Promise((resolve, reject) => {
    PromiseModel.createSchema.validate(
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
