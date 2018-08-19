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
const functions = require('firebase-functions');
const express_1 = __importDefault(require('express'));
const lodash_1 = __importDefault(require('lodash'));
const politician_1 = __importDefault(require('../models/politician'));
// politicians.get('/')
// politicians.post('/').json({contributor_id: '123', profile_image: '123', name: 'Umar', primary_position: 'OpenPromises', brief: 'Umar bla bla', description: 'bla bla', status: 'verified', live: true})
// politicians.post('/-L6gfTkNClzZy7w9t_9e').json({contributor_id:'321'})
// politicians.get('/-L6grrLSYEBLbHIxpeGy')
// politicians.delete('/-L6gfTkNClzZy7w9t_9e')
const politicianModel = politician_1.default();
const app = express_1.default();
app.use(cors_1.default({ origin: true }));
app.get('/ping', healthCheck);
app.post('/', createPolitician);
app.post('/:id', updatePolitician);
app.delete('/:id', deletePolitician);
app.get('/', listPoliticians);
app.get('/all', listAllPoliticians);
app.get('/:id', getPolitician);
function healthCheck(req, res) {
  return res.send('pong').end();
}
function createPolitician(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const validatedPolitician = yield _asyncPoliticianValidateCreate(
        req.body
      );
      const politician = yield politicianModel.add(validatedPolitician);
      return politician.status
        ? res.status(politician.status).json(politician)
        : res.json(politician);
    } catch (e) {
      if (e.name === 'ValidationError') {
        return res.status(400).send(e.message);
      }
      console.log(e);
      return res.status(500).end();
    }
  });
}
function listPoliticians(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const politicians = yield politicianModel.list(
        Object.assign({ live: true }, req.query)
      );
      return politicians.status
        ? res.status(politicians.status).json(politicians)
        : res.json(politicians);
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function listAllPoliticians(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const politicians = yield politicianModel.list(req.query);
      return politicians.status
        ? res.status(politicians.status).json(politicians)
        : res.json(politicians);
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function getPolitician(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const politician = yield politicianModel.get(req.params.id);
      return lodash_1.default.isEmpty(politician)
        ? res.status(404).end()
        : res.json(politician);
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  });
}
function updatePolitician(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const validatedPolitician = yield _asyncPoliticianValidateUpdate(
        req.body
      );
      const politician = yield politicianModel.update(
        req.params.id,
        validatedPolitician
      );
      return politician && politician.status
        ? res.status(politician.status).json(politician)
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
function deletePolitician(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      yield politicianModel.remove(req.params.id);
      return res.status(204).end();
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function _asyncPoliticianValidateCreate(dataToValidate) {
  return new Promise((resolve, reject) => {
    politicianModel.createSchema.validate(
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
function _asyncPoliticianValidateUpdate(dataToValidate) {
  return new Promise((resolve, reject) => {
    politicianModel.updateSchema.validate(
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
