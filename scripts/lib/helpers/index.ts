import { DocumentData } from '@google-cloud/firestore';
import utils from '../utils';
import fs from 'fs';

const getAllFromColection = db => async collectionName => {
  const snapshot = await db.collection(collectionName).get();
  return utils.snapshotToArray(snapshot);
};

function parseMatchObj(matchObj) {
  const entries = Object.entries(matchObj);
  let result = { ...matchObj };
  entries.forEach(entry => {
    const [key, value] = entry;
    if (value === 'true') result[key] = true;
    if (value === 'false') result[key] = false;
  });
  return result;
}

function matchDocuments(documents, matchObj) {
  const parsedMatchObj = parseMatchObj(matchObj);
  const entries = Object.entries(parsedMatchObj);
  let result = documents;
  entries.forEach(entry => {
    const [key, value] = entry;
    result = documents.filter(item => item[key] === value);
  });
  return result;
}

function readJsonFile(filepath) {
  let raw = fs.readFileSync(filepath);
  return JSON.parse(raw.toString());
}

function writeArrayToJsonFile(array, filepath) {
  fs.writeFileSync(filepath, JSON.stringify(array));
  console.log(`Wrote to ${filepath}`);
}

export default {
  getAllFromColection,
  matchDocuments,
  readJsonFile,
  writeArrayToJsonFile
};
