const admin = require('firebase-admin');

const firebaseAuth = function(req, res, next) {
  const sentToken = req.headers['x_firebase_token'];
  const userEmail = req.headers['x_user_email'];
  const userName = req.headers['x_user_name'];
  const userPhoto = req.headers['x_user_photo'];

  if (!sentToken) {
    res.status(400);
    res.send('None shall pass');
  } else {
    admin
      .auth()
      .verifyIdToken(sentToken)
      .then(decodedToken => {
        // TODO: check whether userEmail already in list of contributors

        // TODO: if exists, get the contributor_id
        // TODO: if does not exist, create contributor then get contributor_id
        // TODO: attach contributor_id in request.params.contributor_id

        var uid = decodedToken.uid;
        return uid;
      })
      .catch(error => {
        res.status(400);
        res.send('None shall pass');
      });

    return next();
  }
};

module.exports = {
  firebaseAuth
};
