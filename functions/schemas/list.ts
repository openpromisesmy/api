import joi = require('joi');

export interface IList {
  title: string;
  created_at: string;
  updated_at: string;
}

export const create = joi.object().keys({
  title: joi.string().required(),
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
  updated_at: joi
    .date()
    .iso()
    .default(() => new Date(), 'the time of update')
});
