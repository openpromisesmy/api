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

const malaysianStates = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Kuala Lumpur',
  'Labuan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Putrajaya',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu'
];

export interface IPromise {
  category?: string;
  context?: string;
  contributor_id: string;
  cover_image?: string;
  created_at: string;
  description?: string;
  live: boolean;
  notes?: string;
  politician_id: string;
  post_url?: string;
  quote: string;
  source_date: string;
  source_name: string;
  source_url: string;
  state?: string;
  status: string;
  title: string;
  updated_at: string;
  elaboration?: string;
  deadline?: string;
  review_date?: string;
  clauses?: {
    broken?: string;
    fulfilled?: string;
    progress?: string;
  };
}

export const create = joi.object().keys({
  category: joi.string(),
  clauses: joi.object().keys({
    broken: joi.string(),
    fulfilled: joi.string(),
    progress: joi.string()
  }),
  context: joi.string(),
  contributor_id: joi.string().required(),
  cover_image: joi.string().uri(),
  created_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of creation'),
  deadline: joi.date().iso(),
  description: joi.string(),
  elaboration: joi.string(),
  live: joi.boolean().default(false),
  notes: joi.string(),
  politician_id: joi.string().required(),
  post_url: joi.string(),
  quote: joi.string().required(),
  review_date: joi.date().iso(),
  source_date: joi
    .string()
    .isoDate()
    .required(),
  source_name: joi.string().required(),
  source_url: joi
    .string()
    .uri()
    .required(),
  state: joi.string().valid(malaysianStates),
  status: joi
    .string()
    .allow(promiseStatusValues)
    .default('Review Needed'),
  title: joi.string().required(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

export const update = joi.object().keys({
  category: joi.string(),
  clauses: joi.object().keys({
    broken: joi.string(),
    fulfilled: joi.string(),
    progress: joi.string()
  }),
  context: joi.string(),
  contributor_id: joi.string(),
  cover_image: joi.string().uri(),
  deadline: joi.date().iso(),
  description: joi.string(),
  elaboration: joi.string(),
  live: joi.boolean(),
  notes: joi.string(),
  politician_id: joi.string(),
  post_url: joi.string(),
  quote: joi.string(),
  review_date: joi.date().iso(),
  source_date: joi
    .string()
    .isoDate()
    .required(),
  source_name: joi.string(),
  source_url: joi.string().uri(),
  state: joi.string().valid(malaysianStates),
  status: joi
    .string()
    .allow(promiseStatusValues)
    .default('Review Needed'),
  title: joi.string(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});
