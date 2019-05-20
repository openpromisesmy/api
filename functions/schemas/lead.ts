import joi from 'joi';
import utils from '../etc/utils';

export interface ILead {
  assigned_tracker: string;
  created_at: string;
  link: string;
  notes: string;
  original_promise: string;
  reviewed_by: string;
  review_status: string;
  submitter: string;
  type: string;
  updated_at: string;
}

export const create = joi.object().keys({
  assigned_tracker: joi.string().required(),
  created_at: joi
    .date()
    .iso()
    .default(utils.now, 'Time of creation'),
  link: joi.string().required(),
  notes: joi.string().required(),
  original_promise: joi.string().required(),
  reviewed_by: joi.string().required(),
  review_status: joi.string().required(),
  submitter: joi.string().required(),
  type: joi.string().required(),
  updated_at: joi
    .date()
    .iso()
    .default(utils.now, 'Time of update')
});

export const update = joi.object().keys({
  assigned_tracker: joi.string().required(),
  created_at: joi
    .date()
    .iso()
    .default(utils.now, 'Time of creation'),
  link: joi.string().required(),
  notes: joi.string().required(),
  original_promise: joi.string().required(),
  reviewed_by: joi.string().required(),
  review_status: joi.string().required(),
  submitter: joi.string().required(),
  type: joi.string().required(),
  updated_at: joi
    .date()
    .iso()
    .default(utils.now, 'Time of update')
});
