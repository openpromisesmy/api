const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const contributors = require('./api/contributors');
const politicians = require('./api/politicians');
const promises = require('./api/promises');
const promiseUpdates = require('./api/promiseUpdate');
const stats = require('./api/stats');

module.exports = {
  contributors,
  politicians,
  promises,
  promiseUpdates,
  stats
};
