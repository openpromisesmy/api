import joi from 'joi';

export const create = joi.object().keys({
  link: joi.string().required(),
  review_status: joi.string().required(),
  type: joi.string().required(),
  submitter: joi.string().required(),
  reviewed_by: joi.string().required(),
  notes: joi.string().required(),
  assigned_tracker: joi.string().required(),
  original_promise: joi.string().required()
});
