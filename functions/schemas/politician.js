const joi = require('joi');
const util = require('../etc/util');

const create = joi.object().keys({
  contributor_id: joi.string().required(),
  profile_image: joi
    .string()
    .uri()
    .required(),
  name: joi.string().required(),
  primary_position: joi.string().required(),
  brief: joi.string().required(),
  description: joi.string(),
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

const update = joi.object().keys({
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

module.exports = {
  create,
  update
};
