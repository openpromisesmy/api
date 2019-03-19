import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';

import boolParser from 'express-query-boolean';
import middlewares from '../etc/middlewares';

const { firebaseAuth, notImplemented } = middlewares;

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post('/', firebaseAuth, notImplemented);

app.get('/all', firebaseAuth, notImplemented);

app.get('/:id', firebaseAuth, notImplemented);

app.post('/:id', firebaseAuth, notImplemented);

app.delete('/:id', firebaseAuth, notImplemented);

export = functions.https.onRequest(app);
