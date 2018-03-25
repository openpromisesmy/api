const admin = require('firebase-admin');
const contributorModel = require('../models/contributor');
const contributors = contributorModel();

const firebaseAuth = function(req, res, next) {
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
        // TODO: check whether userEmail already in list of contributors
        contributors
          .find({ email })
          .then(contributor => {
            if (_.isEmpty(contributor)) {
              //  TODO: refactor below, which is just taken from model
              return contributors.createSchema.validate(
                user,
                (err, validatedData) => {
                  if (err) return res.status(400).send(err.message);

                  return contributors
                    .add(validatedData)
                    .then(result => {
                      req.params.contributor_id = contributor.id; // check that
                      return next();
                    })
                    .catch(e => {
                      console.log(e);
                      return res.status(500).end();
                    });
                }
              );

              // createContributor
            } else {
              req.params.contributor_id = contributor.id; // check that
              return next();
            }
          })
          .catch(e => {
            console.log(e);
            res.status(500).end();
          });

        // TODO: if exists, get the contributor_id
        // TODO: if does not exist, create contributor then get contributor_id
        // TODO: attach contributor_id in request.params.contributor_id

        var uid = decodedToken.uid;
        return uid;
      })
      .catch(error => {
        console.log(error);
        res.status(400);
        res.send('There has been an error in authorization.');
      });
  }
};

module.exports = {
  firebaseAuth
};
