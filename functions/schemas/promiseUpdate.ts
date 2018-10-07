import joi from 'joi';
import util from '../etc/util';

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

export interface IPromiseUpdate {
  contributor_id: string;
  cover_image?: string;
  created_at: string;
  description?: string; // displayed publicly
  live: boolean;
  notes?: string; // for internal use
  promise_id: string;
  quote: string;
  source_date: string;
  source_name: string;
  source_url: string;
  status: string;
  title: string;
  updated_at: string;
}

export const create = joi.object().keys({
  contributor_id: joi.string().required(),
  cover_image: joi.string().uri(),
  created_at: joi
    .string()
    .isoDate()
    .default(util.now, 'Time of creation'),
  description: joi.string(), // displayed publicly
  live: joi.boolean().default(false),
  notes: joi.string(), // for internal use
  promise_id: joi.string().required(),
  quote: joi.string().required(),
  source_date: joi
    .string()
    .isoDate()
    .required(),
  source_name: joi.string().required(),
  source_url: joi
    .string()
    .uri()
    .required(),
  status: joi
    .string()
    .allow(promiseStatusValues)
    .required()
    .default('Review Needed'),
  title: joi.string().required(),
  updated_at: joi
    .string()
    .isoDate()
    .default(util.now, 'Time of update')
});

export const update = joi.object().keys({
  contributor_id: joi.string().required(),
  cover_image: joi.string().uri(),
  created_at: joi
    .string()
    .isoDate()
    .required(),
  description: joi.string(), // displayed publicly
  live: joi.boolean().default(false),
  notes: joi.string(), // for internal use
  promise_id: joi.string().required(),
  quote: joi.string().required(),
  source_date: joi
    .string()
    .isoDate()
    .required(),
  source_name: joi.string().required(),
  source_url: joi
    .string()
    .uri()
    .required(),
  status: joi
    .string()
    .allow(promiseStatusValues)
    .required()
    .default('Review Needed'),
  title: joi.string().required(),
  updated_at: joi
    .string()
    .isoDate()
    .default(util.now, 'Time of update')
});
