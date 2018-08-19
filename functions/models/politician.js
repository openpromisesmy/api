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
const politician_1 = require('../schemas/politician');
const contributor_1 = __importDefault(require('./contributor'));
const db = firebase_admin_1.default.firestore();
const contributor = contributor_1.default();
const collection = db.collection('politicians');
function add(data) {
  return __awaiter(this, void 0, void 0, function*() {
    const con = yield contributor.get(data.contributor_id);
    if (lodash_1.default.isEmpty(con)) {
      return { status: 404, message: 'Invalid Contributor' };
    }
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
    const coll = doc.data();
    return lodash_1.default.isEmpty(coll)
      ? {}
      : util_1.default.toObject(id, coll);
  });
}
function list(query) {
  return __awaiter(this, void 0, void 0, function*() {
    let ref = collection;
    if (lodash_1.default.isEmpty(query)) {
      for (let x in query) {
        if (x === 'orderBy') {
          ref = collection.orderBy(query[x], query.reverse ? 'desc' : 'asc');
        } else {
          ref = collection.where(x, '==', query[x]);
        }
      }
    }
    const snapshot = yield ref.get();
    return util_1.default.snapshotToArray(snapshot);
  });
}
function update(id, updateData) {
  return __awaiter(this, void 0, void 0, function*() {
    const politician = yield get(id);
    if (lodash_1.default.isEmpty(politician)) {
      return { status: 404, message: 'Invalid Politicain' };
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
    const snapshot = yield collection
      .where('live', '==', true)
      .select()
      .get();
    return { livePoliticians: snapshot.size };
  });
}
module.exports = () => ({
  add,
  createSchema: politician_1.create,
  get,
  list,
  remove,
  stats,
  update,
  updateSchema: politician_1.update
});
