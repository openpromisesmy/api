'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
const cors_1 = __importDefault(require('cors'));
const express_1 = __importDefault(require('express'));
const functions = require('firebase-functions');
const contributor_1 = __importDefault(require('../models/contributor'));
const politician_1 = __importDefault(require('../models/politician'));
const promise_1 = __importDefault(require('../models/promise'));
const contributors = contributor_1.default();
const politicians = politician_1.default();
const promises = promise_1.default();
// stats.get('/ping')
// stats.get('/general_stats')
const app = express_1.default();
app.use(cors_1.default({ origin: true }));
app.get('/ping', healthCheck);
app.get('/general_stats', generalStats);
function healthCheck(req, res) {
  return res.send('pong').end();
}
function generalStats(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const allStats = yield Promise.all([
        contributors.stats(),
        politicians.stats(),
        promises.stats()
      ]);
      return res.json(_buildGeneralStats(allStats));
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function _buildGeneralStats(statsFromModels) {
  return statsFromModels.reduce((acc, stats, i) => {
    switch (i) {
      case 0:
        return Object.assign({}, acc, { contributors: stats });
      case 1:
        return Object.assign({}, acc, { politicians: stats });
      case 2:
        return Object.assign({}, acc, { promises: stats });
      default:
        return Object.assign({}, acc, stats);
    }
  }, {});
}
module.exports = functions.https.onRequest(app);
