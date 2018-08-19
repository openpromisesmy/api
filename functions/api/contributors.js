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
const contributor_1 = __importDefault(require('../models/contributor'));
// contributors.get('/')
// contributors.post('/').json({ profile_image: 'https://assets.openpromises.com/DSCF8873.jpg', name: 'Umar Rasydan', email: 'umarrasydan@gmail.com', contact: '+60172562786', status: 'Admin', live: true })
// contributors.post('/-L6kq7u9sLz9fI2GuQ-h').json({name:'Umar Rasydan Romli'})
// contributors.get('/-L6kq7u9sLz9fI2GuQ-h')
// contributors.delete('/-L6gfTkNClzZy7w9t_9e')
const contributorModel = contributor_1.default();
const app = express_1.default();
app.use(cors_1.default({ origin: true }));
app.get('/ping', healthCheck);
app.post('/', createContributor);
app.post('/:id', updateContributor);
app.delete('/:id', deleteContributor);
app.get('/', listContributors);
app.get('/:id', getContributor);
function healthCheck(req, res) {
  return res.send('pong').end();
}
function createContributor(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const validatedContributor = yield _asyncContributorValidateCreate(
        req.body
      );
      const contributor = yield contributorModel.add(validatedContributor);
      return contributor.status
        ? res.status(contributor.status).json(contributor)
        : res.json(contributor);
    } catch (e) {
      if (e.name === 'ValidationError') {
        return res.status(400).send(e.message);
      }
      console.log(e);
      return res.status(500).end();
    }
  });
}
function listContributors(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const contributors = yield contributorModel.list(req.query);
      return contributors.status
        ? res.status(contributors.status).json(contributors)
        : res.json(contributors);
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  });
}
function getContributor(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const contributor = yield contributorModel.get(req.params.id);
      return lodash_1.default.isEmpty(contributor)
        ? res.status(404).end()
        : res.json(contributor);
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  });
}
function updateContributor(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const validatedContributor = yield _asyncContributorValidateUpdate(
        req.body
      );
      const contributor = yield contributorModel.update(
        req.params.id,
        validatedContributor
      );
      return contributor && contributor.status
        ? res.status(contributor.status).json(contributor)
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
function deleteContributor(req, res) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      yield contributorModel.remove(req.params.id);
      return res.status(204).end();
    } catch (e) {
      console.log(e);
      return res.status(500).end();
    }
  });
}
function _asyncContributorValidateCreate(dataToValidate) {
  return new Promise((resolve, reject) => {
    contributorModel.createSchema.validate(
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
function _asyncContributorValidateUpdate(dataToValidate) {
  return new Promise((resolve, reject) => {
    contributorModel.updateSchema.validate(
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
