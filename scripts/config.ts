require('dotenv').config();
const READ = {
  COLLECTION_NAME: process.env.READ_COLLECTION_NAME,
  CONCERNED_FIELDS: process.env.READ_CONCERNED_FIELDS.split(','),
  MATCH_KEYWORD: process.env.READ_MATCH_KEYWORD,
  MATCH_PROPERTY: process.env.READ_MATCH_PROPERTY,
  MATCH_VALUE: process.env.READ_MATCH_VALUE
};

const WRITE = {
  COLLECTION_NAME: 'promises',
  MANIFESTO_LIST_ID: 'YtIeJ0L72ged8cpKmJWx',
  NEW_VALUE: 'Sabah'
};

export default {
  READ,
  WRITE
};
