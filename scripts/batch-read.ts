import { DocumentData } from '@google-cloud/firestore';
import utils from './utils';
import db from './db';
import { IFindKeywordInObjectFieldsParams, IPrintLengthParams } from './types';

// DO NOT WRITE ANYTHING USING THIS SCRIPT
// USE batch-write instead

const config = {
  COLLECTION_NAME: 'promises',
  CONCERNED_FIELDS: ['quote', 'title'],
  MATCH_KEYWORD: 'sabah',
  MATCH_PROPERTY: 'politician_id',
  MATCH_VALUE: '-L6lZDRxNJ9pFJ9y0TGo'
};

function findKeywordInField(keyword: string, value: string) {
  const present = value.toLowerCase().includes(keyword.toLowerCase());
  return present ? value : false;
}

function findKeywordInObjectFields({
  object,
  fields,
  keyword
}: IFindKeywordInObjectFieldsParams) {
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

function printLength(obj: IPrintLengthParams) {
  const key = Object.keys(obj)[0];
  const length = obj[key].length;
  console.log(key, ':', length);
}

async function batchRead() {
  const snapshot = await db.collection(config.COLLECTION_NAME).get();

  const allDocuments: DocumentData[] = utils.snapshotToArray(snapshot);
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
  console.log(result);
  return result;
}

export default batchRead;
