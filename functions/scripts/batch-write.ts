import util from '../etc/utils';
import batchRead from './batch-read';
import db from './db';
import firebase from 'firebase-admin';
import { DocumentData } from '@google-cloud/firestore';

// INSTRUCTIONS:
// 1. set read conditions in batch-read.ts
// 2. ensure output is array of only the documents that require updating
// 3. acknowledge
// 4. uncomment warnings

// define here
const config = {
  BATCH_READ: batchRead,
  COLLECTION_NAME: 'promises',
  MANIFESTO_LIST_ID: 'YtIeJ0L72ged8cpKmJWx',
  NEW_VALUE: 'Sabah'
};

const WARNING_TEXT =
  ' \n WARNING!! \n\n `run gcloud beta firestore export` before running this.\n further instructions are below where this warning text is defined. \n\n DANGER!!! \n\n THIS SCRIPT WILL UPDATE ALL DOCUMENTS UNDER THE COLLECTION \n USE MINDFULLY \n TO ENABLE, CHANGE acknowledged to true';

//// glcoud instructions: ////
// go to https://console.cloud.google.com/
// gcloud config set project openpromises-8526c
// gcloud beta firestore export gs://openpromises-8526c.appspot.com

const batch = db.batch();

// const result;
// const totalMatching = 0;
// const notUpdated = 0;
// const alreadyDone = 0;

async function batchWrite() {
  const readResult = await config.BATCH_READ();
  const targetPromises: DocumentData[] = readResult.matchedDocuments;
  // console.log({targetPromises})

  const acknowledged = false;
  if (!acknowledged) {
    console.error(WARNING_TEXT);
    throw new Error(
      'Operation stopped. You have not acknowledged the warning.'
    );
  }

  // const snapshot = await db.collection(config.COLLECTION_NAME).get();

  // result = util.snapshotToArray(snapshot);
  targetPromises.forEach(doc => {
    const ref = db.collection(config.COLLECTION_NAME).doc(doc.id);
    const updateData = {}; // update here
    // WARNING: uncomment below to run update
    // batch.update(ref, updateData);
  });

  // WARNING: uncomment below to commit the change
  // await batch.commit();
}

batchWrite();

// IF READING FROM JSON
// const json = require(`./${COLLECTION_NAME}`);
// for (let child in json) {
//   const id = child;
//   const object = json[id];
//   var ref = db.collection(COLLECTION_NAME).doc(id);
//   batch.set(ref, object);
// }
