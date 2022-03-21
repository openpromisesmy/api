import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';

import middlewares from '../../etc/middlewares';

import addList from './add';
import getList from './get';
import listAllLists from './listAll';
import listLiveLists from './listLive';
import { limiter } from '../ common';

const { firebaseAuth, routePermissions } = middlewares;

const app = express();
app.use(limiter);
app.use(cors({ origin: true }));
// @ts-ignore
app.use(express.json());

app.post('/', firebaseAuth, addList);

app.get('/', listLiveLists);
app.get('/all', firebaseAuth, routePermissions, listAllLists);

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
