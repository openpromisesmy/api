const firebaseAuth = function(req, res, next) {
  if (!req.headers['X_FIREBASE_TOKEN']) {
    res.status(400);
    res.send('None shall pass');
  } else {
    next();
  }
};

module.exports = {
  firebaseAuth
};
