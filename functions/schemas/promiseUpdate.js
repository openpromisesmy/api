const joi = require('joi');
const util = require('../etc/util');

const promiseStatusValues = [
  'Review Needed',
  'Fulfilled',
  'Broken',
  'Partially Fulfilled',
  'In Progress',
  'Not Started',
  'At Risk',
  'Retracted'
];

const create = joi.object().keys({
  promise_id: joi.string().required(),
  contributor_id: joi.string().required(),
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
  title: joi.string().required(),
  quote: joi.string().required(),
  description: joi.string(), // displayed publicly
  notes: joi.string(), // for internal use
  status: joi
    .string()
    .allow(promiseStatusValues)
    .default('Review Needed'),
  live: joi.boolean().default(false),
  created_at: joi
    .string()
    .isoDate()
    .default(util.now, 'Time of creation'),
  updated_at: joi
    .string()
    .isoDate()
    .default(util.now, 'Time of update')
});

const update = joi.object().keys({
  promise_id: joi.string().required(),
  contributor_id: joi.string().required(),
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
  title: joi.string().required(),
  quote: joi.string().required(),
  description: joi.string(), // displayed publicly
  notes: joi.string(), // for internal use
  status: joi
    .string()
    .allow(promiseStatusValues)
    .default('Review Needed'),
  live: joi.boolean().default(false),
  created_at: joi
    .string()
    .isoDate()
    .required(),
  updated_at: joi
    .string()
    .isoDate()
    .default(util.now, 'Time of update')
});

module.exports = {
  create,
  update
};
