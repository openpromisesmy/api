const admin = require('firebase-admin');
const db = admin.firestore();
const joi = require('joi');
const _ = require('lodash');

const util = require('../etc/util');

const contributorModel = require('./contributor');

const contributor = contributorModel();

const createSchema = joi.object().keys({
  contributor_id: joi.string().required(),
  profile_image: joi
    .string()
    .uri()
    .required(),
  name: joi.string().required(),
  primary_position: joi.string().required(),
  brief: joi.string().required(),
  description: joi.string(),
  status: joi.string().required(),
  live: joi.boolean().default(false),
  created_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of creation'),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

const updateSchema = joi.object().keys({
  contributor_id: joi.string(),
  profile_image: joi.string().uri(),
  name: joi.string(),
  primary_position: joi.string(),
  brief: joi.string(),
  description: joi.string(),
  status: joi.string(),
  live: joi.boolean(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

const collection = db.collection('politicians');

const checkContributor = function(contributor) {
  if (_.isEmpty(contributor))
    return this.resolve({ status: 404, message: 'Invalid Contributor' });
  return contributor;
};

const addPolitician = function() {
  return collection.add(this.data).then(ref => {
    if (_.isEmpty(ref)) return reject(new Error('Fail to add'));
    return this.resolve({ id: ref.id });
  });
};
const add = data =>
  new Promise((resolve, reject) =>
    contributor
      .get(data.contributor_id)
      .then(checkContributor.bind({ resolve }))
      .then(addPolitician.bind({ resolve, data }))
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
        ref = ref.where(x, '==', query[x]);
      }
    }
    ref
      .get()
      .then(snapshot => {
        return resolve(util.snapshotToArray(snapshot));
      })
      .catch(e => reject(e));
  });

const checkPoliticianExists = function(politician) {
  if (_.isEmpty(politician))
    return this.resolve({ status: 404, message: 'Invalid Politician' });
};

const updatePolitician = function() {
  return collection
    .doc(this.id)
    .update(this.updateData)
    .then(d => this.resolve(d));
};

const update = (id, updateData) =>
  new Promise((resolve, reject) =>
    get(id)
      .then(checkPoliticianExists.bind({ resolve }))
      .then(updatePolitician.bind({ resolve, id, updateData }))
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

const politician = () => ({
  createSchema,
  updateSchema,
  list,
  get,
  add,
  update,
  remove
});

module.exports = politician;
