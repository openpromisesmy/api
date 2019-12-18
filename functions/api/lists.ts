import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';

import middlewares from '../etc/middlewares';

import addList from './lists/add';
import getList from './lists/get';
import listLiveLists from './lists/listLive';

const { firebaseAuth } = middlewares;

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post('/', firebaseAuth, addList);

app.get('/', listLiveLists);

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
