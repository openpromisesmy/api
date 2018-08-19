'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const joi_1 = __importDefault(require('joi'));
const util_1 = __importDefault(require('../etc/util'));
exports.create = joi_1.default.object().keys({
  brief: joi_1.default.string().required(),
  contributor_id: joi_1.default.string().required(),
  created_at: joi_1.default
    .date()
    .iso()
    .default(util_1.default.now, 'Time of creation'),
  description: joi_1.default.string(),
  live: joi_1.default.boolean().default(false),
  name: joi_1.default.string().required(),
  primary_position: joi_1.default.string().required(),
  profile_image: joi_1.default
    .string()
    .uri()
    .required(),
  status: joi_1.default.string(),
  updated_at: joi_1.default
    .date()
    .iso()
    .default(util_1.default.now, 'Time of update')
});
exports.update = joi_1.default.object().keys({
  brief: joi_1.default.string(),
  contributor_id: joi_1.default.string(),
  description: joi_1.default.string(),
  live: joi_1.default.boolean(),
  name: joi_1.default.string(),
  primary_position: joi_1.default.string(),
  profile_image: joi_1.default.string().uri(),
  status: joi_1.default.string(),
  updated_at: joi_1.default
    .date()
    .iso()
    .default(util_1.default.now, 'Time of update')
});
