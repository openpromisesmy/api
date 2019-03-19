import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';

import boolParser from 'express-query-boolean';
import middlewares from '../etc/middlewares';

const { firebaseAuth } = middlewares;

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// TODO:
// export this to a separate module
//
const notImplemented = (req: express.Request, res: express.Response) => {
  res.sendStatus(501);
};

app.post('/', firebaseAuth, notImplemented);

app.get('/all', firebaseAuth, notImplemented);

app.get('/:id', firebaseAuth, notImplemented);

app.post('/:id', firebaseAuth, notImplemented);

app.delete('/:id', firebaseAuth, notImplemented);

export = functions.https.onRequest(app);
