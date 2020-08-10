import express from 'express';
import admin from 'firebase-admin';
import ContributorModel from '../models/contributor';
import { IContributor } from '../schemas/contributor';

import { IncomingHttpHeaders } from 'http';
import _ from 'lodash';

import { ValidationError } from 'joi';

const contributorModel = ContributorModel();

function _asyncValidateContributor(dataToValidate: object) {
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

export default {
  firebaseAuth,
  logger,
  routePermissions
};

export async function firebaseAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (_missingHeaders(req.headers, res)) {
    return;
  }

  const sentToken = req.headers['x-firebase-token'];
  const email = req.headers['x-user-email'];
  const name = req.headers['x-user-name'];
  const profileImage = req.headers['x-user-photo'];

  const user = {
    email,
    name,
    profile_image: profileImage
  };

  if (!sentToken) {
    return res.status(400).send('You need to be authorized to do this.');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(sentToken);
    const contributors = await contributorModel.list(
      { email },
      admin.firestore()
    );

    // commented out 3 June 2019. This create logic caused an error. Also, it's currently handled by the front end. Upon GoogleSignin, if no user is found, frontend will post user using firebase token.
    // WHEN contributor does not exist yet, create
    // if (_.isEmpty(contributors)) {
    //   try {
    //     const validatedContributor = await _asyncValidateContributor(user);

    //     const newContributor = await contributorModel.add(validatedContributor);

    //     // TODO: verify that this works
    //     // accessing the result property might need modification
    //     const contributorId = Object.keys(newContributor.id)[0];
    //     req.body.contributor_id = contributorId;
    //     res.locals.scope = newContributor.status;

    //     return next();
    //   } catch (e) {
    //     if (e.name === 'ValidationError') {
    //       return res.status(400).send(e.message);
    //     }

    //     return res.status(500).end();
    //   }
    // }

    if (contributors.length > 0) {
      const contributor = _.first(contributors) as IContributor;
      const status = contributor.status;
      res.locals.scope = status; // TODO, rename to role
    }
    // WHEN contributor already exists, attach contributor_id
    if (decodedToken.email !== email) {
      console.error('Sent email does not match decoded token email.');

      return res.status(400).send('You need to be authorized to do this.');
    }

    return next();
  } catch (e) {
    console.error(e);
    return res.status(401).send('There has been an error in authorization.');
  }
}

function routePermissions(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const scopes = [{ path: '/all', role: 'Admin' }];
  let error;

  scopes.forEach(scope => {
    if (scope.path === req.path) {
      if (res.locals.scope !== scope.role) {
        error = true;
      }
    }
  });

  if (error) {
    return res.status(403).send('None shall pass. Insufficient scope.');
  }

  return next();
}

function logger(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { params } = req;
  // console.log({ params });
  next();
}

function _missingHeaders(headers: IncomingHttpHeaders, res: express.Response) {
  // @TODO: use joi validation
  let error;
  ['x-firebase-token', 'x-user-email'].forEach(key => {
    const value = headers[key];
    if (value === undefined || value === '') {
      res.status(400).send(`${key} must be present in header`);
      error = true;
    }
  });
  return error;
}
