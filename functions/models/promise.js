const admin = require('firebase-admin');
const db = admin.firestore();
const joi = require('joi');
const _ = require('lodash');

const util = require('../etc/util');

const politicianModel = require('./politician');
const contributorModel = require('./contributor');

const politician = politicianModel();
const contributor = contributorModel();

const createSchema = joi.object().keys({
  contributor_id: joi.string().required(),
  politician_id: joi.string().required(),
  source_date: joi
    .string()
    .isoDate()
    .required(),
  source_name: joi.string().required(),
  source_url: joi
    .string()
    .uri()
    .required(),
  cover_image: joi.string().uri(),
  post_url: joi.string(),
  category: joi.string(),
  title: joi.string().required(),
  quote: joi.string().required(),
  notes: joi.string(),
  status: joi
    .string()
    .allow([
      'Review Needed',
      'Fulfilled',
      'Broken',
      'Partially Fulfilled',
      'In Progress',
      'Not Started'
    ])
    .default('Review Needed'),
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
  politician_id: joi.string(),
  source_date: joi.date().iso(),
  source_name: joi.string(),
  source_url: joi.string().uri(),
  cover_image: joi.string().uri(),
  category: joi.string(),
  title: joi.string(),
  quote: joi.string(),
  notes: joi.string(),
  status: joi
    .string()
    .allow([
      'Review Needed',
      'Fulfilled',
      'Broken',
      'Partially Fulfilled',
      'In Progress',
      'Not Started'
    ])
    .default('Review Needed'),
  live: joi.boolean(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

const collection = db.collection('promises');

const add = data =>
  new Promise((resolve, reject) =>
    Promise.all([
      politician.get(data.politician_id),
      contributor.get(data.contributor_id)
    ])
      .then(([politician, contributor]) => {
        if (_.isEmpty(politician))
          return resolve({ status: 404, message: 'Invalid Politician' });

        if (_.isEmpty(contributor))
          return resolve({ status: 404, message: 'Invalid Contributor' });

        return collection
          .add(data)
          .then(ref => {
            if (_.isEmpty(ref)) return reject(new Error('Fail to add'));
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

const update = (id, updateData) =>
  new Promise((resolve, reject) =>
    get(id)
      .then(promise => {
        if (_.isEmpty(promise))
          return resolve({ status: 404, message: 'Invalid Promise' });

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

const promise = () => ({
  createSchema,
  updateSchema,
  list,
  get,
  add,
  update,
  remove
});

module.exports = promise;
