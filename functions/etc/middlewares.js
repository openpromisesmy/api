const admin = require('firebase-admin');

const firebaseAuth = function(req, res, next) {
  const sentToken = req.headers['x_firebase_token'];
  if (!sentToken) {
    res.status(400);
    res.send('None shall pass');
  } else {
    admin
      .auth()
      .verifyIdToken(sentToken)
      .then(decodedToken => {
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
