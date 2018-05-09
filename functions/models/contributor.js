const admin = require('firebase-admin');
const joi = require('joi').extend(require('joi-phone-number'));
const _ = require('lodash');

const util = require('../etc/util');

const createSchema = joi.object().keys({
  profile_image: joi
    .string()
    .uri()
    .default('https://assets.openpromises.com/avatar.png'),
  name: joi.string().required(),
  email: joi
    .string()
    .email()
    .required(),
  contact: joi
    .string()
    .phoneNumber({ defaultCountry: 'MY', format: 'international' }),
  status: joi.string().default('Tracker'),
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
  profile_image: joi.string().uri(),
  name: joi.string(),
  email: joi.string().email(),
  contact: joi
    .string()
    .phoneNumber({ defaultCountry: 'MY', format: 'international' }),
  status: joi.string(),
  live: joi.boolean().default(false),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

const add = data =>
  new Promise((resolve, reject) =>
    admin
      .database()
      .ref('/contributors')
      .push(data)
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
      .ref(`/contributors/${id}`)
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
        const result = _.isEmpty(data) ? {} : util.toObject(data);

        return resolve(result);
      })
      .catch(e => reject(e))
  );

const list = () =>
  new Promise((resolve, reject) =>
    admin
      .database()
      .ref('/contributors')
      .once('value')
      .then(snapshot => resolve(util.toArray(snapshot.val())))
      .catch(e => reject(e))
  );

const update = (id, updateData) =>
  new Promise((resolve, reject) =>
    get(id)
      .then(contributor => {
        if (_.isEmpty(contributor))
          return resolve({ status: 404, message: 'Invalid Contributor' });

        return admin
          .database()
          .ref(`/contributors/${id}`)
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
      .ref(`/contributors/${id}`)
      .remove()
      .then(() => resolve())
      .catch(e => {
        console.log(e);
        return reject(e);
      })
  );

const contributor = () => ({
  createSchema,
  updateSchema,
  list,
  get,
  find,
  add,
  update,
  remove
});

module.exports = contributor;
