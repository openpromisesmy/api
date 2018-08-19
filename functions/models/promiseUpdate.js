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
const promiseUpdate_1 = require('../schemas/promiseUpdate');
const promise_1 = __importDefault(require('./promise'));
const db = firebase_admin_1.default.firestore();
const promise = promise_1.default();
const collection = db.collection('promiseUpdates');
function add(data) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const pro = yield promise.get(data.promise_id);
      if (lodash_1.default.isEmpty(pro)) {
        return { status: 404, message: 'Invalid Promise' };
      }
      const ref = yield collection.add(data);
      if (lodash_1.default.isEmpty(ref)) {
        throw new Error('Failed to add');
      }
      yield updateSourcePromiseStatus(data.promise_id);
      return { id: ref.id };
    } catch (e) {
      if (e.status) {
        return e;
      }
      throw e;
    }
  });
}
function get(id) {
  return __awaiter(this, void 0, void 0, function*() {
    const doc = yield collection.doc(id).get();
    const data = doc.data();
    return lodash_1.default.isEmpty(data)
      ? {}
      : util_1.default.toObject(id, data);
  });
}
// add in query for promise_id, and source_date (asc)
function list(query) {
  return __awaiter(this, void 0, void 0, function*() {
    let ref = collection;
    if (!lodash_1.default.isEmpty(query)) {
      lodash_1.default.forIn(query, (value, key) => {
        switch (key) {
          case 'orderBy':
            ref = collection.orderBy(value, query.reverse ? 'desc' : 'asc');
            break;
          default:
            ref = collection.where(key, '==', value);
            break;
        }
      });
    }
    const snapshot = yield ref.get();
    return util_1.default.snapshotToArray(snapshot);
  });
}
function update(id, data) {
  return __awaiter(this, void 0, void 0, function*() {
    const promiseUpdate = yield get(id);
    if (lodash_1.default.isEmpty(promiseUpdate)) {
      return { status: 404, message: 'Invalid Promise Update' };
    }
    const [updatedPromise] = yield Promise.all([
      collection.doc(id).update(data),
      updateSourcePromiseStatus(data.promise_id)
    ]);
    return updatedPromise;
  });
}
function remove(id) {
  return __awaiter(this, void 0, void 0, function*() {
    return collection.doc(id).delete();
  });
}
function updateSourcePromiseStatus(promiseId) {
  return __awaiter(this, void 0, void 0, function*() {
    const promiseUpdates = yield list({
      orderBy: 'source_date',
      promise_id: promiseId
    });
    const latestUpdate = lodash_1.default.last(promiseUpdates);
    const latestStatus = latestUpdate.status;
    return promise.update(promiseId, { status: latestStatus });
  });
}
module.exports = () => ({
  add,
  createSchema: promiseUpdate_1.create,
  get,
  list,
  remove,
  update,
  updateSchema: promiseUpdate_1.update
});
