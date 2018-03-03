const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const politicians = require('./api/politicians');
const promises = require('./api/promises');

module.exports = {
  politicians,
  promises
};
