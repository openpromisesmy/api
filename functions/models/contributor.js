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
const lodash_1 = __importDefault(require('lodash'));
const util_1 = __importDefault(require('../etc/util'));
const contributor_1 = require('../schemas/contributor');
const db = firebase_admin_1.default.firestore();
const collection = db.collection('contributors');
function add(data) {
  return __awaiter(this, void 0, void 0, function*() {
    const ref = yield collection.add(data);
    if (lodash_1.default.isEmpty(ref)) {
      throw new Error('Fail to add');
    }
    return { id: ref.id };
  });
}
function get(id) {
  return __awaiter(this, void 0, void 0, function*() {
    const doc = yield collection.doc(id).get();
    const data = doc.data();
    const contributor = lodash_1.default.isEmpty(data)
      ? {}
      : util_1.default.toObject(id, data);
    return contributor;
  });
}
function find(match) {
  return __awaiter(this, void 0, void 0, function*() {
    const snapshot = yield firebase_admin_1.default
      .database()
      .ref('/contributors')
      .orderByChild(Object.keys(match)[0])
      .equalTo(Object.keys(match).map(key => match[key][0]))
      .once('value');
    const data = snapshot.val();
    const id = Object.keys(data)[0];
    const contributor = lodash_1.default.isEmpty(data)
      ? {}
      : util_1.default.toObject(id, data[id]);
    return contributor;
  });
}
function list(query) {
  return __awaiter(this, void 0, void 0, function*() {
    const ref = lodash_1.default.isEmpty(query)
      ? collection
      : collection.where(
          util_1.default.getKey(query),
          '==',
          util_1.default.getValue(query)
        );
    const snapshot = yield ref.get();
    return util_1.default.snapshotToArray(snapshot);
  });
}
function update(id, updateData) {
  return __awaiter(this, void 0, void 0, function*() {
    const contributor = yield get(id);
    if (lodash_1.default.isEmpty(contributor)) {
      return { status: 404, message: 'Invalid Contributor' };
    }
    return collection.doc(id).update(updateData);
  });
}
function remove(id) {
  return __awaiter(this, void 0, void 0, function*() {
    return collection.doc(id).delete();
  });
}
function stats() {
  return __awaiter(this, void 0, void 0, function*() {
    const snapshot = yield collection.select().get();
    return { count: snapshot.size };
  });
}
module.exports = () => ({
  add,
  createSchema: contributor_1.create,
  find,
  get,
  list,
  remove,
  stats,
  update,
  updateSchema: contributor_1.update
});
