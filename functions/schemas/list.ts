import joi = require('joi');

export interface IList {
  title: string;
  promise_ids: Array<string>;
  created_at: string;
  updated_at: string;
}

export const create = joi.object().keys({
  title: joi.string().required(),
  promise_ids: joi
    .array()
    .items(joi.string())
    .default([]),
  created_at: joi
    .date()
    .iso()
    .default(() => new Date(), 'the time of creation'),
  updated_at: joi
    .date()
    .iso()
    .default(() => new Date(), 'the time of update')
});

export const update = joi.object().keys({
  title: joi.string(),
  promise_ids: joi.array().items(joi.string()),
  updated_at: joi
    .date()
    .iso()
    .default(() => new Date(), 'the time of update')
});
