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
          .find({ email })
          .then(contributor => {
            // WHEN contributor does not exist yet, create
            if (_.isEmpty(contributor)) {
              return contributors.createSchema.validate(
                user,
                (err, validatedData) => {
                  if (err) return res.status(400).send(err.message);

                  return contributors
                    .add(validatedData)
                    .then(result => {
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
              // WHEN contributor already exists, attach contributor_id
              if (decodedToken.email !== email) {
                res.status(400).send('You need to be authorized to do this.');
                console.error('Sent email does not match decoded token email.');
              }

              const contributor_id = Object.keys(contributor.id)[0];
              req.body.contributor_id = contributor_id;
              res.locals.scope = contributor.status; // TODO, rename to role
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
        res.status(400);
        res.send('There has been an error in authorization.');
      });
  }
};

const logger = function(req, res, next) {
  // console.log(req.query);
  next();
};

module.exports = {
  firebaseAuth,
  logger
};
