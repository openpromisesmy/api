import cors from 'cors';
import express from 'express';
import _ from 'lodash';

import functions from 'firebase-functions';

import ContributorModel from '../models/contributor';

import { ValidationError } from 'joi';

// contributors.get('/')
// contributors.post('/').json({ profile_image: 'https://assets.openpromises.com/DSCF8873.jpg', name: 'Umar Rasydan', email: 'umarrasydan@gmail.com', contact: '+60172562786', status: 'Admin', live: true })
// contributors.post('/-L6kq7u9sLz9fI2GuQ-h').json({name:'Umar Rasydan Romli'})
// contributors.get('/-L6kq7u9sLz9fI2GuQ-h')
// contributors.delete('/-L6gfTkNClzZy7w9t_9e')

const contributorModel = ContributorModel();

const app = express();

app.use(cors({ origin: true }));

app.get('/ping', healthCheck);

app.post('/', createContributor);
app.post('/:id', updateContributor);
app.delete('/:id', deleteContributor);

app.get('/', listContributors);
app.get('/:id', getContributor);

export = functions.https.onRequest(app);

function healthCheck(req: express.Request, res: express.Response) {
  return res.send('pong').end();
}

async function createContributor(req: express.Request, res: express.Response) {
  try {
    const validatedContributor = await _asyncContributorValidateCreate(
      req.body
    );

    const contributor = await contributorModel.add(validatedContributor);

    return contributor.status
      ? res.status(contributor.status).json(contributor)
      : res.json(contributor);
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
    const contributors = await contributorModel.list(req.query);

    return contributors.status
      ? res.status(contributors.status).json(contributors)
      : res.json(contributors);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getContributor(req: express.Request, res: express.Response) {
  try {
    const contributor = await contributorModel.get(req.params.id);

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
      validatedContributor
    );

    return contributor && contributor.status
      ? res.status(contributor.status).json(contributor)
      : res.status(204).end();
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
    await contributorModel.remove(req.params.id);

    return res.status(204).end();
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

function _asyncContributorValidateCreate(dataToValidate: object) {
  return new Promise((resolve, reject) => {
    contributorModel.createSchema.validate(
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

function _asyncContributorValidateUpdate(dataToValidate: object) {
  return new Promise((resolve, reject) => {
    contributorModel.updateSchema.validate(
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
