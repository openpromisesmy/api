import joi from 'joi';
import joiPhoneNumber from 'joi-phone-number';
import util = require('../etc/util');
joi.extend(joiPhoneNumber);

export interface IContributor {
  contact?: string;
  created_at: string;
  email: string;
  live: boolean;
  name: string;
  profile_image: string;
  status: string;
  updated_at: string;
}

export const create = joi.object().keys({
  contact: joi
    .string()
    .phoneNumber({ defaultCountry: 'MY', format: 'international' }),
  created_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of creation'),
  email: joi
    .string()
    .email()
    .required(),
  live: joi.boolean().default(false),
  name: joi.string().required(),
  profile_image: joi
    .string()
    .uri()
    .default('https://assets.openpromises.com/avatar.png'),
  status: joi.string().default('Tracker'),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

export const update = joi.object().keys({
  contact: joi
    .string()
    .phoneNumber({ defaultCountry: 'MY', format: 'international' }),
  created_at: joi.date().iso(),
  email: joi.string().email(),
  live: joi.boolean().default(false),
  name: joi.string(),
  profile_image: joi.string().uri(),
  status: joi.string(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});
