import utils from '../utils';

const getAllFromColection = db => async collection => {
  const snapshot = await db.collection(COLLECTION_NAME).get();
  const allDocuments: DocumentData[] = utils.snapshotToArray(snapshot);
};

export default {
  getAllFromColection
};
