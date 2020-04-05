'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const utils_1 = __importDefault(require('../etc/utils'));
const db_1 = __importDefault(require('./db'));
// DO NOT WRITE ANYTHING USING THIS SCRIPT
// USE batch-write instead
const config = {
  COLLECTION_NAME: 'promises',
  CONCERNED_FIELDS: ['quote', 'title'],
  MATCH_KEYWORD: 'sabah',
  MATCH_PROPERTY: 'politician_id',
  MATCH_VALUE: '-L6lZDRxNJ9pFJ9y0TGo'
};
function findKeywordInField(keyword, value) {
  const present = value.toLowerCase().includes(keyword.toLowerCase());
  return present ? value : false;
}
function findKeywordInObjectFields({ object, fields, keyword }) {
  let keywordExists = false;
  fields.forEach(field => {
    const value = object[field];
    const valueWithKeyword = findKeywordInField(keyword, value);
    if (valueWithKeyword) {
      keywordExists = true;
    }
  });
  return keywordExists ? object : null;
}
function printLength(obj) {
  const key = Object.keys(obj)[0];
  const length = obj[key].length;
  console.log(key, ':', length);
}
function batchRead() {
  return __awaiter(this, void 0, void 0, function*() {
    const snapshot = yield db_1.default
      .collection(config.COLLECTION_NAME)
      .get();
    const allDocuments = utils_1.default.snapshotToArray(snapshot);
    // matchedDocuments option A - find by single property-value match
    const matchedDocuments = allDocuments.filter(
      item => item[config.MATCH_PROPERTY] === config.MATCH_VALUE
    );
    // matchedDocuments option B - find by presence of keyword in selected fields
    // const matchedDocuments = allDocuments.filter(item =>
    //   findKeywordInObjectFields({
    //     object: item,
    //     fields: config.CONCERNED_FIELDS,
    //     keyword: config.MATCH_KEYWORD
    //   })
    // );
    const alreadyReflecting = matchedDocuments.filter(
      document => document.state === config.MATCH_KEYWORD
    );
    const hasOtherValue = matchedDocuments.filter(
      document => document.state && document.state !== config.MATCH_KEYWORD
    );
    const valueUndefined = matchedDocuments.filter(
      document => document.state === undefined
    );
    const result = {
      alreadyReflecting,
      hasOtherValue,
      matchedDocuments,
      valueUndefined
    };
    return result;
  });
}
exports.default = batchRead;
