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
const lodash_1 = __importDefault(require('lodash'));
const body_parser_1 = __importDefault(require('body-parser'));
const express_query_boolean_1 = __importDefault(
  require('express-query-boolean')
);
const cors_1 = __importDefault(require('cors'));
const express_1 = __importDefault(require('express'));
const functions = require('firebase-functions');
const middlewares_1 = require('../etc/middlewares');
const promise_1 = __importDefault(require('../models/promise'));
// promises.get('/')
// promises.post('/').json({ contributor_id: '123', politician_id: '-L5o5YwQa-jgdt_4sPqe', source_date: '2018-03-03T16:20:01.072Z', source_name: 'Bernama', source_url: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md', cover_image: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md', category: 'potato', title: 'Promising promises', quote: '"...potato said potata"', status: 'In review' })
// promises.post('/-L6kQKs6_GqlUfualdcA').json({contributor_id:'321'})
// promises.get('/-L6grrLSYEBLbHIxpeGy')
// promises.delete('/-L6gfTkNClzZy7w9t_9e')
const promiseModel = promise_1.default();
const app = express_1.default();
app.use(cors_1.default({ origin: true }));
app.use(body_parser_1.default.json());
app.use(express_query_boolean_1.default());
app.get('/ping', healthCheck);
app.post('/', middlewares_1.firebaseAuth, createPromise);
app.get(
  '/all',
  middlewares_1.firebaseAuth,
  middlewares_1.routePermissions,
  listAllPromises
);
app.post('/:id', updatePromise);
app.delete('/:id', deletePromise);
app.get('/', listPromises);
app.get('/:id', getPromise);
function healthCheck(req, res) {
  return res.send('pong').end();
}
function createPromise(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const validatedPromise = yield _asyncPromiseValidateCreate(req.body);
      const promise = yield promiseModel.add(validatedPromise);
      return promise.status
        ? res.status(promise.status).json(promise)
        : res.json(promise);
    } catch (e) {
      if (e.name === 'ValidationError') {
        return res.status(400).send(e.message);
      }
      console.log(e);
      return res.status(500).end();
    }
  });
}
// TODO: check for scope
// if no scope, call list with live:true
// if admin scope, call list with no arguments
// only live Promises shown
function listPromises(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const promises = yield promiseModel.list(
        Object.assign({ live: true }, req.query)
      );
      return promises.status
        ? res.status(promises.status).json(promises)
        : res.json(promises);
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
// lists All Promises, for admin
function listAllPromises(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const promises = yield promiseModel.list(req.query);
      return promises.status
        ? res.status(promises.status).json(promises)
        : res.json(promises);
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function getPromise(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const promise = yield promiseModel.get(req.param.id);
      return lodash_1.default.isEmpty(promise)
        ? res.status(404).end()
        : res.json(promise);
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function updatePromise(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const validatedPromise = yield _asyncPromiseValidateUpdate(req.body);
      const updatedPromise = yield promiseModel.update(
        req.params.id,
        validatedPromise
      );
      return updatedPromise && updatedPromise.status
        ? res.status(updatedPromise.status).json(updatedPromise)
        : res.status(204).end();
    } catch (e) {
      if (e.name === 'ValidationError') {
        return res.status(400).send(e.message);
      }
      console.log(e);
      return res.status(500).end();
    }
  });
}
function deletePromise(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      yield promiseModel.remove(req.params.id);
      return res.status(204).end();
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function _asyncPromiseValidateCreate(dataToValidate) {
  return new Promise((resolve, reject) => {
    promiseModel.createSchema.validate(dataToValidate, (e, validatedData) => {
      if (e) {
        return reject(e);
      }
      return resolve(validatedData);
    });
  });
}
function _asyncPromiseValidateUpdate(dataToValidate) {
  return new Promise((resolve, reject) => {
    promiseModel.updateSchema.validate(dataToValidate, (e, validatedData) => {
      if (e) {
        return reject(e);
      }
      return resolve(validatedData);
    });
  });
}
module.exports = functions.https.onRequest(app);
