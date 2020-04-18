import { DocumentData } from '@google-cloud/firestore';
import utils from '../utils';

const getAllFromColection = db => async collectionName => {
  const snapshot = await db.collection(collectionName).get();
  return utils.snapshotToArray(snapshot);
};

export default {
  getAllFromColection
};
