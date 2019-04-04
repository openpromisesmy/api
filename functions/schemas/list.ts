import joi = require('joi');

export interface IList {
  contributor_id: string;
  live: boolean;
  title: string;
  promise_ids: string[];
  created_at: string;
  updated_at: string;
  description?: string;
}

export const create = joi.object().keys({
  contributor_id: joi.string(),
  created_at: joi
    .date()
    .iso()
    .default(() => new Date(), 'the time of creation'),
  live: joi.bool(),
  promise_ids: joi
    .array()
    .items(joi.string())
    .default([]),
  title: joi.string().required(),
  updated_at: joi
    .date()
    .iso()
    .default(() => new Date(), 'the time of update'),
  description: joi.string().optional()
});

export const update = joi.object().keys({
  contributor_id: joi.string(),
  live: joi.bool(),
  promise_ids: joi.array().items(joi.string()),
  title: joi.string(),
  updated_at: joi
    .date()
    .iso()
    .default(() => new Date(), 'the time of update'),
  description: joi.string().optional()
});
