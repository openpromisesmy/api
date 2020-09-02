import joi from 'joi';
import util from '../etc/utils';

export interface IPolitician {
  administration_name: string;
  brief?: string;
  contact_details: IContactDetails;
  contributor_id: string;
  created_at: string;
  description?: string;
  live: boolean;
  name: string;
  primary_position: string;
  profile_image?: string;
  status?: string;
  updated_at: string;
}

interface IContactDetails {
  email?: string;
  facebook_url?: string;
  twitter_url?: string;
  phone_number?: string;
}

// todo: do the rest
const shared = {
  administration_name: joi.string().valid('Muhyiddin cabinet'),
  brief: joi.string(),
  constituency: joi.string(),
  contact_details: joi.object().keys({
    email: joi.string().email(),
    facebook_url: joi.string().uri(),
    phone_number: joi.string(),
    twitter_url: joi.string().uri()
  }),
  party: joi.string(),
  profile_image: joi.string().uri(),
  term_end: joi.string(),
  term_start: joi.string()
};

export const create = joi.object().keys({
  ...shared,
  contributor_id: joi.string().required(),
  created_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of creation'),
  description: joi.string(),
  live: joi.boolean().default(false),
  name: joi.string().required(),
  primary_position: joi.string().required(),
  status: joi.string(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

export const update = joi.object().keys({
  ...shared,
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
