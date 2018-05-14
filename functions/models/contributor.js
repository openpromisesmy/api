const admin = require('firebase-admin');
const db = admin.firestore();
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

const collection = db.collection('contributors');

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

const list = () =>
  new Promise((resolve, reject) =>
    collection
      .get()
      .then(snapshot => {
        const array = [];
        snapshot.forEach(doc => {
          array.push(util.toObject(doc.id, doc.data()));
        });
        resolve(array);
      })
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
