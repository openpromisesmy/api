const firebaseAuth = function(req, res, next) {
  console.log('FIREBASE AUTH');
  next();
};

module.exports = {
  firebaseAuth
};
