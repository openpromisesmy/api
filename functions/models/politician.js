const admin = require('firebase-admin');
const db = admin.firestore();
const _ = require('lodash');
const util = require('../etc/util');
const contributorModel = require('./contributor');
const contributor = contributorModel();
const collection = db.collection('politicians');
const schema = require('../schemas/politician');
const createSchema = schema.create;
const updateSchema = schema.update;

const checkContributor = function({ resolve, contributor }) {
  if (_.isEmpty(contributor))
    return resolve({ status: 404, message: 'Invalid Contributor' });
  return contributor;
};

const addPolitician = function({ resolve, data }) {
  return collection.add(data).then(ref => {
    if (_.isEmpty(ref)) return reject(new Error('Fail to add'));
    return resolve({ id: ref.id });
  });
};

const add = data =>
  new Promise((resolve, reject) =>
    contributor
      .get(data.contributor_id)
      .then(contributor => checkContributor({ resolve, contributor }))
      .then(() => addPolitician({ resolve, data }))
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

const list = query =>
  new Promise((resolve, reject) => {
    let ref = collection;
    if (!_.isEmpty(query)) {
      for (let x in query) {
        if (x === 'orderBy') {
          ref = ref.orderBy(query[x], query.reverse ? 'desc' : 'asc');
        } else {
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

const checkPoliticianExists = function({ resolve, politician }) {
  if (_.isEmpty(politician))
    return resolve({ status: 404, message: 'Invalid Politician' });
  return politician;
};

const updatePolitician = function({ resolve, id, updateData }) {
  return collection
    .doc(id)
    .update(updateData)
    .then(d => resolve(d));
};

const update = (id, updateData) =>
  new Promise((resolve, reject) =>
    get(id)
      .then(politician => checkPoliticianExists({ resolve, politician }))
      .then(() => updatePolitician({ resolve, id, updateData }))
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
      .where('live', '==', true)
      .select()
      .get()
      .then(snapshot => resolve({ livePoliticians: snapshot.size }))
      .catch(e => reject(e));
  });

const politician = () => ({
  createSchema,
  updateSchema,
  list,
  get,
  add,
  update,
  remove,
  stats
});

module.exports = politician;
