'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
const firebase_admin_1 = __importDefault(require('firebase-admin'));
const functions = require('firebase-functions');
firebase_admin_1.default.initializeApp(functions.config().firebase);
const contributors_1 = __importDefault(require('./api/contributors'));
const politicians_1 = __importDefault(require('./api/politicians'));
const promises_1 = __importDefault(require('./api/promises'));
const promiseUpdate_1 = __importDefault(require('./api/promiseUpdate'));
const stats_1 = __importDefault(require('./api/stats'));
module.exports = {
  contributors: contributors_1.default,
  politicians: politicians_1.default,
  promiseUpdates: promiseUpdate_1.default,
  promises: promises_1.default,
  stats: stats_1.default
};
