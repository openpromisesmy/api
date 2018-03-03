const functions = require("firebase-functions");
const admin = require("firebase-admin");
const joi = require("joi");
const _ = require("lodash");

const util = require("../etc/util");

const defaultConfig = functions.config().firebase;

const createSchema = joi.object().keys({
  contributor_id: joi.string().required(),
  profile_image: joi.string().required(),
  name: joi.string().required(),
  primary_position: joi.string().required(),
  brief: joi.string().required(),
  description: joi.string(),
  status: joi.string().required(),
  live: joi.boolean().default(false),
  created_at: joi
    .date()
    .iso()
    .default(util.now, "Time of creation"),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, "Time of update")
});

const updateSchema = joi.object().keys({
  contributor_id: joi.string(),
  profile_image: joi.string(),
  name: joi.string(),
  primary_position: joi.string(),
  brief: joi.string(),
  description: joi.string(),
  status: joi.string(),
  live: joi.boolean(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, "Time of update")
});

const add = data =>
  new Promise((resolve, reject) => {
    admin
      .database()
      .ref("/politicians")
      .push(data)
      .then(result => {
        if (_.isEmpty(result.key)) return reject(new Error("Fail to add"));
        return resolve({ id: result.key });
      })
      .catch(e => reject(e));
  });

const get = id =>
  new Promise((resolve, reject) => {
    admin
      .database()
      .ref(`/politicians/${id}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();
        const result = _.isEmpty(data) ? {} : util.toObject(id, data);

        return resolve(result);
      })
      .catch(e => reject(e));
  });

const list = () =>
  new Promise((resolve, reject) => {
    admin
      .database()
      .ref("/politicians")
      .once("value")
      .then(snapshot => resolve(util.toArray(snapshot.val())))
      .catch(e => reject(e));
  });

const update = (id, updateData) =>
  new Promise((resolve, reject) => {
    admin
      .database()
      .ref(`/politicians/${id}`)
      .update(updateData)
      .then(() => resolve())
      .catch(e => reject(e));
  });

const remove = id =>
  new Promise((resolve, reject) => {
    admin
      .database()
      .ref(`/politicians/${id}`)
      .remove()
      .then(() => resolve())
      .catch(e => reject(e));
  });

const politicians = ({ config }) => {
  admin.initializeApp(config);
  return {
    createSchema,
    updateSchema,
    list,
    get,
    add,
    update,
    remove
  };
};

const politician = ({ config = defaultConfig } = { config: defaultConfig }) => {
  admin.initializeApp(config);

  return {
    createSchema,
    updateSchema,
    list,
    get,
    add,
    update,
    remove
  };
};

module.exports = politician;
