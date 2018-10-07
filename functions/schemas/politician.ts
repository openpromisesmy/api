import joi from 'joi';
import util from '../etc/util';

export interface IPolitician {
  brief: string;
  contributor_id: string;
  created_at: string;
  description?: string;
  live: boolean;
  name: string;
  primary_position: string;
  profile_image: string;
  status?: string;
  updated_at: string;
}

export const create = joi.object().keys({
  brief: joi.string().required(),
  contributor_id: joi.string().required(),
  created_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of creation'),
  description: joi.string(),
  live: joi.boolean().default(false),
  name: joi.string().required(),
  primary_position: joi.string().required(),
  profile_image: joi
    .string()
    .uri()
    .required(),
  status: joi.string(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

export const update = joi.object().keys({
  brief: joi.string(),
  contributor_id: joi.string(),
  description: joi.string(),
  live: joi.boolean(),
  name: joi.string(),
  primary_position: joi.string(),
  profile_image: joi.string().uri(),
  status: joi.string(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});
