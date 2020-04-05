require('dotenv').config();
export default {
  COLLECTION_NAME: process.env.COLLECTION_NAME,
  CONCERNED_FIELDS: process.env.CONCERNED_FIELDS.split(','),
  MATCH_KEYWORD: process.env.MATCH_KEYWORD,
  MATCH_PROPERTY: process.env.MATCH_PROPERTY,
  MATCH_VALUE: process.env.MATCH_VALUE
};
