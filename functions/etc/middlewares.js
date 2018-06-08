const admin = require('firebase-admin');
const _ = require('lodash');
const contributorModel = require('../models/contributor');
const contributors = contributorModel();

function missingHeaders(headers, res) {
  let error;
  ['x-firebase-token', 'x-user-email', 'x-user-name', 'x-user-photo'].forEach(
    key => {
      const value = headers[key];
      if (value === undefined || value === '') {
        res.status(400).send(`${key} must be present in header`);
        error = true;
      }
    }
  );
  return error;
}

const firebaseAuth = function(req, res, next) {
  if (missingHeaders(req.headers, res)) return;

  const sentToken = req.headers['x-firebase-token'];
  const email = req.headers['x-user-email'];
  const name = req.headers['x-user-name'];
  const profile_image = req.headers['x-user-photo'];

  const user = {
    email,
    name,
    profile_image
  };

  if (!sentToken) {
    res.status(400);
    res.send('You need to be authorized to do this.');
  } else {
    admin
      .auth()
      .verifyIdToken(sentToken)
      .then(decodedToken => {
        // TODO: address callback hell below
        contributors
          .list({ email })
          .then(result => {
            // WHEN contributor does not exist yet, create
            if (result.length === 0) {
              return contributors.createSchema.validate(
                user,
                (err, validatedData) => {
                  if (err) return res.status(400).send(err.message);

                  return contributors
                    .add(validatedData)
                    .then(result => {
                      // TODO: verify that this works
                      // accessing the result property might need modification
                      req.body.contributor_id = result.id;
                      res.locals.scope = result.status;
                      return next();
                    })
                    .catch(e => {
                      console.error(e);
                      return res.status(500).end();
                    });
                }
              );
            } else {
              const contributor = result[0];
              // WHEN contributor already exists, attach contributor_id
              if (decodedToken.email !== email) {
                res.status(400).send('You need to be authorized to do this.');
                console.error('Sent email does not match decoded token email.');
              }

              const contributor_id = Object.keys(contributor.id)[0];
              req.body.contributor_id = contributor_id;
              const status = contributor.status;
              res.locals.scope = status; // TODO, rename to role
              return next();
            }
          })
          .catch(e => {
            console.error(e);
            res.status(500).end();
          });
        return undefined;
      })
      .catch(error => {
        console.error(error);
        res.status(403);
        res.send('There has been an error in authorization.');
      });
  }
};

const routePermissions = function(req, res, next) {
  const scopes = [{ path: '/all', role: 'Admin' }];
  let error;
  scopes.forEach(scope => {
    if (scope.path === req.path) {
      if (res.locals.scope !== scope.role) {
        error = true;
      }
    }
  });
  if (error)
    return res.status(403).send('None shall pass. Insufficient scope.');
  return next();
};

const logger = function(req, res, next) {
  const { params } = req;
  // console.log({ params });
  next();
};

module.exports = {
  firebaseAuth,
  logger,
  routePermissions
};
