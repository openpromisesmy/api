const admin = require('firebase-admin');
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

const add = data =>
  new Promise((resolve, reject) =>
    contributor
      .get(data.contributor_id)
      .then(contributor => {
        if (_.isEmpty(contributor))
          return resolve({ status: 404, message: 'Invalid Contributor' });

        return admin
          .database()
          .ref('/politicians')
          .push(data);
      })
      .then(result => {
        if (_.isEmpty(result.key)) return reject(new Error('Fail to add'));
        return resolve({ id: result.key });
      })
      .catch(e => {
        console.log(e);
        return reject(e);
      })
  );

const get = id =>
  new Promise((resolve, reject) =>
    admin
      .database()
      .ref(`/politicians/${id}`)
      .once('value')
      .then(snapshot => {
        const data = snapshot.val();
        const result = _.isEmpty(data) ? {} : util.toObject(id, data);

        return resolve(result);
      })
      .catch(e => {
        console.log(e);
        return reject(e);
      })
  );

const list = () =>
  new Promise((resolve, reject) =>
    admin
      .database()
      .ref('/politicians')
      .once('value')
      .then(snapshot => resolve(util.toArray(snapshot.val())))
      .catch(e => reject(e))
  );

const update = (id, updateData) =>
  new Promise((resolve, reject) =>
    get(id)
      .then(politician => {
        if (_.isEmpty(politician))
          return resolve({ status: 404, message: 'Invalid Politician' });

        return admin
          .database()
          .ref(`/politicians/${id}`)
          .update(updateData);
      })
      .then(d => resolve(d))
      .catch(e => {
        console.log(e);
        return reject(e);
      })
  );

const remove = id =>
  new Promise((resolve, reject) =>
    admin
      .database()
      .ref(`/politicians/${id}`)
      .remove()
      .then(() => resolve())
      .catch(e => {
        console.log(e);
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
