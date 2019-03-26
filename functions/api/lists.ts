import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';

import boolParser from 'express-query-boolean';
import middlewares from '../etc/middlewares';

import createList from './lists/create';
import getList from './lists/get';
import listLists from './lists/list';

const { firebaseAuth } = middlewares;

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post('/', firebaseAuth, createList);

app.get('/', listLists);

app.get('/:id', getList);

app.post('/:id', firebaseAuth, notImplemented);

app.delete('/:id', firebaseAuth, notImplemented);

export = functions.https.onRequest(app);

function notImplemented(
  req: express.Request,
  res: express.Response,
  next?: express.NextFunction
) {
  res.sendStatus(501);
}
