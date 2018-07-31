const admin = require('firebase-admin');
const db = admin.firestore();
const _ = require('lodash');
const util = require('../etc/util');
const schema = require('../schemas/contributor');
const collection = db.collection('contributors');
const createSchema = schema.create;
const updateSchema = schema.update;

const add = data =>
  new Promise((resolve, reject) =>
    collection
      .add(data)
      .then(ref => {
        if (_.isEmpty(ref)) return reject(new Error('Fail to add'));
        return resolve({ id: ref.id });
      })
      .catch(e => {
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

const find = match =>
  new Promise((resolve, reject) =>
    admin
      .database()
      .ref('/contributors')
      .orderByChild(Object.keys(match)[0])
      .equalTo(Object.keys(match).map(key => match[key])[0])
      .once('value')
      .then(snapshot => {
        const data = snapshot.val();
        const id = Object.keys(data)[0];
        const contributor = data[id];
        const result = _.isEmpty(data) ? {} : util.toObject(id, contributor);

        return resolve(result);
      })
      .catch(e => reject(e))
  );

const list = query =>
  new Promise((resolve, reject) => {
    let ref = collection;
    if (!_.isEmpty(query)) {
      ref = ref.where(util.getKey(query), '==', util.getValue(query));
    }

    ref
      .get()
      .then(snapshot => {
        return resolve(util.snapshotToArray(snapshot));
      })
      .catch(e => reject(e));
  });

const update = (id, updateData) =>
  new Promise((resolve, reject) =>
    get(id)
      .then(contributor => {
        if (_.isEmpty(contributor))
          return resolve({ status: 404, message: 'Invalid Contributor' });

        // @TODO: fix https://github.com/xjamundx/eslint-plugin-promise/issues/42
        return collection
          .doc(id)
          .update(updateData)
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

const stats = () =>
  new Promise((resolve, reject) => {
    collection
      .select()
      .get()
      .then(snapshot => resolve({ count: snapshot.size }))
      .catch(e => reject(e));
  });

const contributor = () => ({
  createSchema,
  updateSchema,
  list,
  get,
  find,
  add,
  update,
  remove,
  stats
});

module.exports = contributor;
