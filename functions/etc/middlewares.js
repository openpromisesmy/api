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
const firebase_admin_1 = __importDefault(require('firebase-admin'));
const contributor_1 = __importDefault(require('../models/contributor'));
const lodash_1 = __importDefault(require('lodash'));
const contributorModel = contributor_1.default();
function _asyncValidateContributor(dataToValidate) {
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
function firebaseAuth(req, res, next) {
  return __awaiter(this, void 0, void 0, function*() {
    if (_missingHeaders(req.headers, res)) {
      return;
    }
    const sentToken = req.headers['x-firebase-token'];
    const email = req.headers['x-user-email'];
    const name = req.headers['x-user-name'];
    const profileImage = req.headers['x-user-photo'];
    const user = {
      email,
      name,
      profile_image: profileImage
    };
    if (!sentToken) {
      return res.status(400).send('You need to be authorized to do this.');
    }
    try {
      const decodedToken = yield firebase_admin_1.default
        .auth()
        .verifyIdToken(sentToken);
      const contributors = yield contributorModel.list({ email });
      // WHEN contributor does not exist yet, create
      if (lodash_1.default.isEmpty(contributors)) {
        try {
          const validatedContributor = yield _asyncValidateContributor(user);
          const newContributor = yield contributorModel.add(
            validatedContributor
          );
          // TODO: verify that this works
          // accessing the result property might need modification
          const contributorId = Object.keys(newContributor.id)[0];
          req.body.contributor_id = contributorId;
          res.locals.scope = newContributor.status;
          return next();
        } catch (e) {
          if (e.name === 'ValidationError') {
            return res.status(400).send(e.message);
          }
          return res.status(500).end();
        }
      }
      const contributor = lodash_1.default.first(contributors);
      // WHEN contributor already exists, attach contributor_id
      if (decodedToken.email !== email) {
        console.error('Sent email does not match decoded token email.');
        return res.status(400).send('You need to be authorized to do this.');
      }
      const status = contributor.status;
      res.locals.scope = status; // TODO, rename to role
      return next();
    } catch (e) {
      console.error(e);
      return res.status(401).send('There has been an error in authorization.');
    }
  });
}
function routePermissions(req, res, next) {
  const scopes = [{ path: '/all', role: 'Admin' }];
  let error;
  scopes.forEach(scope => {
    if (scope.path === req.path) {
      if (res.locals.scope !== scope.role) {
        error = true;
      }
    }
  });
  if (error) {
    return res.status(403).send('None shall pass. Insufficient scope.');
  }
  return next();
}
function logger(req, res, next) {
  const { params } = req;
  // console.log({ params });
  next();
}
function _missingHeaders(headers, res) {
  // @TODO: use joi validation
  let error;
  ['x-firebase-token', 'x-user-email'].forEach(key => {
    const value = headers[key];
    if (value === undefined || value === '') {
      res.status(400).send(`${key} must be present in header`);
      error = true;
    }
  });
  return error;
}
module.exports = {
  firebaseAuth,
  logger,
  routePermissions
};
