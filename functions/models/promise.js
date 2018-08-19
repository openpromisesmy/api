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
const promise_1 = require('../schemas/promise');
const contributor_1 = __importDefault(require('./contributor'));
const politician_1 = __importDefault(require('./politician'));
const db = firebase_admin_1.default.firestore();
const politician = politician_1.default();
const contributor = contributor_1.default();
const collection = db.collection('promises');
function add(data) {
  return __awaiter(this, void 0, void 0, function*() {
    try {
      const [pol, con] = yield Promise.all([
        politician.get(data.politician_id),
        contributor.get(data.contributor_id)
      ]);
      if (lodash_1.default.isEmpty(pol)) {
        return { status: 404, message: 'Invalid Politician' };
      }
      if (lodash_1.default.isEmpty(con)) {
        return { status: 404, message: 'Invalid Contributor' };
      }
      const ref = yield collection.add(data);
      if (lodash_1.default.isEmpty(ref)) {
        throw new Error('Fail to add');
      }
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
    const promise = doc.data();
    return lodash_1.default.isEmpty(promise)
      ? {}
      : util_1.default.toObject(id, promise);
  });
}
function list(query) {
  return __awaiter(this, void 0, void 0, function*() {
    let ref = collection;
    // apply ref modification when there are query params
    if (!lodash_1.default.isEmpty(query)) {
      lodash_1.default.forIn(query, (value, key) => {
        switch (key) {
          case 'pageSize':
            ref = collection.limit(Number(value));
            break;
          case 'startAfter':
            ref = collection.startAfter(value);
            break;
          case 'orderBy':
            ref = collection.orderBy(value, query.reverse ? 'desc' : 'asc');
            break;
          default:
            ref = collection.where(key, '==', value);
            break;
        }
      });
    }
    const snapshot = ref.get();
    return util_1.default.snapshotToArray(snapshot);
  });
}
function update(id, updateData) {
  return __awaiter(this, void 0, void 0, function*() {
    const promise = yield get(id);
    if (lodash_1.default.isEmpty(promise)) {
      return { status: 404, message: 'Invalid Promise' };
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
    const servicesSnapshot = yield Promise.all([
      db
        .collection('promises')
        .where('live', '==', true)
        .select('politician_id', 'status')
        .get(),
      db
        .collection('politicians')
        .where('live', '==', true)
        .select('_id')
        .get()
    ]);
    const promises = util_1.default.snapshotToArray(servicesSnapshot[0]);
    const politicians = util_1.default.snapshotToArray(servicesSnapshot[1]);
    const livePromisesByLivePoliticians = _filterPromisesWithLivePoliticians(
      promises,
      politicians
    );
    const statsByStatus = _aggregateByStatus(livePromisesByLivePoliticians);
    return {
      countByStatus: statsByStatus,
      livePromises: promises.length,
      livePromisesByLivePoliticians: livePromisesByLivePoliticians.length
    };
  });
}
function _filterPromisesWithLivePoliticians(promises, politicians) {
  return promises.reduce(
    (acc, p) =>
      politicians.find(pl => pl.id === p.politician_id)
        ? acc.concat(
            Object.assign({}, p, {
              status: p.status ? p.status : 'Review Needed'
            })
          )
        : acc,
    []
  );
}
function _aggregateByStatus(livePromisesByLivePoliticians) {
  return lodash_1.default.countBy(livePromisesByLivePoliticians, 'status');
}
module.exports = () => ({
  add,
  createSchema: promise_1.create,
  get,
  list,
  remove,
  stats,
  update,
  updateSchema: promise_1.update
});
