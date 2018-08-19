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
const lodash_1 = __importDefault(require('lodash'));
const functions = require('firebase-functions');
const promiseUpdate_1 = __importDefault(require('../models/promiseUpdate'));
const promiseUpdateModel = promiseUpdate_1.default();
const app = express_1.default();
app.use(cors_1.default({ origin: true }));
app.get('/ping', healthCheck);
app.post('/', createPromiseUpdate);
app.post('/:id', updatePromiseUpdate);
app.delete('/:id', deletePromiseUpdate);
app.get('/', listPromiseUpdates);
app.get('/:id', getPromiseUpdate);
function healthCheck(req, res) {
  return res.send('pong').end();
}
function createPromiseUpdate(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const validatedPromiseUpdate = yield _asyncPromiseUpdateValidateCreate(
        req.body
      );
      const promiseUpdate = yield promiseUpdateModel.add(
        validatedPromiseUpdate
      );
      return promiseUpdate.status
        ? res.status(promiseUpdate.status).json(promiseUpdate)
        : res.json(promiseUpdate);
    } catch (e) {
      if (e.name === 'ValidationError') {
        return res.status(400).send(e.message);
      }
      console.log(e);
      return res.status(500).end();
    }
  });
}
function listPromiseUpdates(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const promiseUpdates = yield promiseUpdateModel.list(req.query);
      // This might be a potential bug
      // promiseUpdates is an array
      return promiseUpdates.status
        ? res.status(promiseUpdates.status).json(promiseUpdates)
        : res.json(promiseUpdates);
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function getPromiseUpdate(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const promiseUpdate = yield promiseUpdateModel.get(req.params.id);
      return lodash_1.default.isElement(promiseUpdate)
        ? res.status(404).end()
        : res.json(promiseUpdate);
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  });
}
function updatePromiseUpdate(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const validatedPromiseUpdate = yield _asyncPromiseUpdateValidateUpdate(
        req.body
      );
      const updatedPromise = yield promiseUpdateModel.update(
        req.params.id,
        validatedPromiseUpdate
      );
      return updatedPromise && updatedPromise.status
        ? res.status(updatedPromise.status).json(updatedPromise)
        : res.status(204).end();
    } catch (e) {
      if (e.name === 'ValidationError') {
        return res.status(400).send(e.message);
      }
    }
  });
}
function deletePromiseUpdate(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      yield promiseUpdateModel.remove(req.params.id);
      return res.status(204).end();
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function _asyncPromiseUpdateValidateCreate(dataToValidate) {
  return new Promise((resolve, reject) => {
    promiseUpdateModel.createSchema.validate(
      dataToValidate,
      (e, validatedData) => {
        if (e) {
          return reject(e);
        }
        return resolve(validatedData);
      }
    );
  });
}
function _asyncPromiseUpdateValidateUpdate(dataToValidate) {
  return new Promise((resolve, reject) => {
    promiseUpdateModel.updateSchema.validate(
      dataToValidate,
      (e, validatedData) => {
        if (e) {
          return reject(e);
        }
        return resolve(validatedData);
      }
    );
  });
}
module.exports = functions.https.onRequest(app);
