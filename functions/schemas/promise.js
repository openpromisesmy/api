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
    .allow(promiseStatusValues)
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

const update = joi.object().keys({
  contributor_id: joi.string(),
  politician_id: joi.string(),
  source_date: joi
    .string()
    .isoDate()
    .required(),
  source_name: joi.string(),
  source_url: joi.string().uri(),
  cover_image: joi.string().uri(),
  category: joi.string(),
  title: joi.string(),
  quote: joi.string(),
  notes: joi.string(),
  status: joi
    .string()
    .allow(promiseStatusValues)
    .default('Review Needed'),
  live: joi.boolean(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update'),
  post_url: joi.string()
});

module.exports = {
  create,
  update
};
