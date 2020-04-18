import { DocumentData } from '@google-cloud/firestore';
import firebase from 'firebase-admin';
import utils from '../utils';
import config from '../config';
import db from '../db';
import fs from 'fs';
import filterArray from '../filter-array';

// INSTRUCTIONS:
// set config in config.ts
// update filterArray function to what's needed
// ensure output is array of only the documents that require updating
// acknowledge
// uncomment warnings, search for 'WARNING:'

const { COLLECTION_NAME } = config.DELETE;

const WARNING_TEXT =
  ' \n WARNING!! \n\n `run gcloud beta firestore export` before running this.\n further instructions are below where this warning text is defined. \n\n DANGER!!! \n\n THIS SCRIPT WILL UPDATE ALL DOCUMENTS UNDER THE COLLECTION \n USE MINDFULLY \n TO ENABLE, CHANGE acknowledged to true';

//// glcoud instructions: ////
// go to https://console.cloud.google.com/
// gcloud config set project openpromises-8526c
// gcloud beta firestore export gs://openpromises-8526c.appspot.com

const batch = db.batch();

function readInputFile(filepath) {
  let raw = fs.readFileSync(filepath);
  return JSON.parse(raw.toString());
}

const INPUT_FILEPATH = config.DELETE.INPUT_DIR + config.DELETE.INPUT_FILE;

async function batchDelete() {
  const docs = readInputFile(INPUT_FILEPATH);
  const targetDocs = filterArray(docs);
  // WARNING:
  const ACKNOWLEDGED = false;
  if (!ACKNOWLEDGED) {
    console.error(WARNING_TEXT);
    throw new Error(
      'Operation stopped. You have not acknowledged the warning.'
    );
  }

  // below line is just for displaying the doc
  // const snapshot = await db.collection(COLLECTION_NAME).get();

  // result = utils.snapshotToArray(snapshot);
  targetDocs.forEach(doc => {
    const ref = db.collection(COLLECTION_NAME).doc(doc.id);
    // WARNING: uncomment below to run operation
    // batch.delete(ref);
  });

  // WARNING: uncomment below to commit the change
  // await batch.commit();
}

export default batchDelete;
