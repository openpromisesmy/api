const admin = require('firebase-admin');
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
  status: joi.string(),
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
  status: joi.string(),
  live: joi.boolean(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

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

        return admin
          .database()
          .ref('/promises')
          .push(data);
      })
      .then(result => {
        if (_.isEmpty(result)) return reject(new Error('Fail to add'));

        return resolve({ id: result.key });
      })
      .catch(e => {
        if (e.status) return resolve(e);

        console.error(e);
        return reject(e);
      })
  );

const get = id =>
  new Promise((resolve, reject) =>
    admin
      .database()
      .ref(`/promises/${id}`)
      .once('value')
      .then(snapshot => {
        const data = snapshot.val();
        const result = _.isEmpty(data) ? {} : util.toObject(id, data);

        return resolve(result);
      })
      .catch(e => {
        console.error(e);
        return reject(e);
      })
  );

const list = query => {
  const value = query[Object.keys(query)[0]];
  const key = Object.keys(query)[0];
  const ref = admin.database().ref('/promises');
  if (query) {
    return new Promise((resolve, reject) =>
      ref
        .orderByChild(key)
        .equalTo(value)
        .once('value')
        .then(snapshot => {
          if (_.isEmpty(snapshot.val()))
            return resolve({
              status: 404,
              message: `No promises found for query ${JSON.stringify(query)}`
            });

          return resolve(util.toArray(snapshot.val()));
        })
        .catch(e => {
          console.error(e);
          return reject(e);
        })
    );
  } else {
    return new Promise((resolve, reject) =>
      ref
        .equalTo(value, key)
        .once('value')
        .then(snapshot => {
          if (_.isEmpty(snapshot.val()))
            return resolve({
              status: 404,
              message: `No promises found for query ${JSON.stringify(query)}`
            });

          return resolve(util.toArray(snapshot.val()));
        })
        .catch(e => {
          console.error(e);
          return reject(e);
        })
    );
  }
};

const update = (id, updateData) =>
  new Promise((resolve, reject) =>
    get(id)
      .then(promise => {
        if (_.isEmpty(promise))
          return resolve({ status: 404, message: 'Invalid Promise' });

        return admin
          .database()
          .ref(`/promises/${id}`)
          .update(updateData);
      })
      .then(d => resolve(d))
      .catch(e => {
        console.error(e);
        return reject(e);
      })
  );

const remove = id =>
  new Promise((resolve, reject) =>
    admin
      .database()
      .ref(`/promises/${id}`)
      .remove()
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
