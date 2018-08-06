const admin = require('firebase-admin');
const db = admin.firestore();
const _ = require('lodash');
const util = require('../etc/util');
const promiseModel = require('./promise');
const promise = promiseModel();
const schema = require('../schemas/promiseUpdate');
const createSchema = schema.create;
const updateSchema = schema.update;

const collection = db.collection('promiseUpdates');

const add = data =>
  new Promise((resolve, reject) =>
    promise
      .get(data.promise_id)
      .then(promise => {
        if (_.isEmpty(promise))
          return resolve({ status: 404, message: 'Invalid Promise' });

        // @TODO: fix https://github.com/xjamundx/eslint-plugin-promise/issues/42
        return collection
          .add(data)
          .then(ref => {
            if (_.isEmpty(ref)) return reject(new Error('Failed to add'));
            return resolve({ id: ref.id });
          })
          .catch(e => {
            console.error(e);
            return reject(e);
          });
      })
      .catch(e => {
        if (e.status) return resolve(e);

        console.error(e);
        return reject(e);
      })
  );

const get = id =>
  new Promise((resolve, reject) =>
    collection
      .doc(id)
      .get()
      .then(doc => {
        const data = doc.data();
        const result = _.isEmpty(data) ? {} : util.toObject(id, data);

        return resolve(result);
      })
      .catch(e => {
        console.log(e);
        return reject(e);
      })
  );

// add in query for promise_id, and source_date (asc)
const list = query =>
  new Promise((resolve, reject) => {
    const paginationQueries = ['orderBy', 'reverse'];
    let ref = collection;
    if (!_.isEmpty(query)) {
      for (let x in query) {
        if (paginationQueries.includes(x)) {
          // for pagination
          switch (x) {
            case 'orderBy':
              ref = ref.orderBy(query[x], query.reverse ? 'desc' : 'asc');
              break;
            default:
              break;
          }
        } else {
          // for other queries
          ref = ref.where(x, '==', query[x]);
        }
      }
    }
    ref
      .get()
      .then(snapshot => {
        return resolve(util.snapshotToArray(snapshot));
      })
      .catch(e => reject(e));
  });

const update = (id, validatedData) =>
  new Promise((resolve, reject) =>
    get(id)
      .then(promiseUpdate => {
        if (_.isEmpty(promiseUpdate))
          return resolve({ status: 404, message: 'Invalid Promise Update' });

        // TODO: check if promiseUpdate is latest for promise
        // If so, update status
        // TODO: do this in POST promiseUpdate too
        const isLatest = true;
        if (isLatest) {
          const latestStatus = validatedData.status;
          promise
            .update(validatedData.promise_id, { status: latestStatus })
            .then(res => console.log(res))
            .catch(err => console.error(err));
        }

        // @TODO: fix https://github.com/xjamundx/eslint-plugin-promise/issues/42
        return collection
          .doc(id)
          .update(validatedData)
          .then(d => resolve(d))
          .catch(e => reject(id));
      })
      .catch(e => {
        console.error(e);
        return reject(e);
      })
  );

const remove = id =>
  new Promise((resolve, reject) =>
    collection
      .doc(id)
      .delete()
      .then(() => resolve())
      .catch(e => {
        console.error(e);
        return reject(e);
      })
  );

const promiseUpdate = () => ({
  createSchema,
  updateSchema,
  list,
  get,
  add,
  update,
  remove
});

module.exports = promiseUpdate;