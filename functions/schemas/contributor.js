const joi = require('joi').extend(require('joi-phone-number'));
const util = require('../etc/util');

const create = joi.object().keys({
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

const update = joi.object().keys({
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

module.exports = {
  create,
  update
};
