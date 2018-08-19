'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const joi_1 = __importDefault(require('joi'));
const util_1 = __importDefault(require('../etc/util'));
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
exports.create = joi_1.default.object().keys({
  category: joi_1.default.string(),
  contributor_id: joi_1.default.string().required(),
  cover_image: joi_1.default.string().uri(),
  created_at: joi_1.default
    .date()
    .iso()
    .default(util_1.default.now, 'Time of creation'),
  live: joi_1.default.boolean().default(false),
  notes: joi_1.default.string(),
  politician_id: joi_1.default.string().required(),
  post_url: joi_1.default.string(),
  quote: joi_1.default.string().required(),
  source_date: joi_1.default
    .string()
    .isoDate()
    .required(),
  source_name: joi_1.default.string().required(),
  source_url: joi_1.default
    .string()
    .uri()
    .required(),
  status: joi_1.default
    .string()
    .allow(promiseStatusValues)
    .default('Review Needed'),
  title: joi_1.default.string().required(),
  updated_at: joi_1.default
    .date()
    .iso()
    .default(util_1.default.now, 'Time of update')
});
exports.update = joi_1.default.object().keys({
  category: joi_1.default.string(),
  contributor_id: joi_1.default.string(),
  cover_image: joi_1.default.string().uri(),
  live: joi_1.default.boolean(),
  notes: joi_1.default.string(),
  politician_id: joi_1.default.string(),
  post_url: joi_1.default.string(),
  quote: joi_1.default.string(),
  source_date: joi_1.default
    .string()
    .isoDate()
    .required(),
  source_name: joi_1.default.string(),
  source_url: joi_1.default.string().uri(),
  status: joi_1.default
    .string()
    .allow(promiseStatusValues)
    .default('Review Needed'),
  title: joi_1.default.string(),
  updated_at: joi_1.default
    .date()
    .iso()
    .default(util_1.default.now, 'Time of update')
});
