import utils from './utils';
require('dotenv').config();

function setValuesToUndefinedIfEmptyString(object) {
  Object.keys(object).forEach(key => {
    const value = object[key];
    if (value === '') object[key] = undefined;
  });
  return object;
}

let READ = {
  COLLECTION_NAME: process.env.READ_COLLECTION_NAME,
  CONCERNED_FIELDS: process.env.READ_CONCERNED_FIELDS.split(','),
  MATCH_KEYWORD: process.env.READ_MATCH_KEYWORD,
  MATCH_PROPERTY: process.env.READ_MATCH_PROPERTY,
  MATCH_VALUE: process.env.READ_MATCH_VALUE,
  OUTPUT_DIR: './data/',
  OUTPUT_FILE: process.env.READ_OUTPUT_FILE
};

let WRITE = {
  COLLECTION_NAME: 'promises',
  MANIFESTO_LIST_ID: 'YtIeJ0L72ged8cpKmJWx',
  NEW_VALUE: 'Sabah'
};

let DELETE = {
  INPUT_DIR: process.env.DELETE_INPUT_DIR,
  INPUT_FILE: process.env.DELETE_INPUT_FILE,
  COLLECTION_NAME: process.env.DELETE_COLLECTION_NAME
};

READ = setValuesToUndefinedIfEmptyString(READ);
WRITE = setValuesToUndefinedIfEmptyString(WRITE);
DELETE = setValuesToUndefinedIfEmptyString(DELETE);

export default {
  READ,
  WRITE,
  DELETE
};
