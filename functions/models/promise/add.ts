import { IPromise } from '../../schemas/promise';
import {
  ensureAllListsExistById,
  ensureContributorExistsById,
  ensurePoliticianExistsById,
  updatePromiseIdInLists
} from './index';
import admin = require('firebase-admin');

const add = (db: admin.firestore.Firestore) => async (data: IPromise) => {
  await ensurePoliticianExistsById(data.politician_id);
  await ensureContributorExistsById(data.contributor_id);
  const addResult = await db.collection('promises').add(data);

  if (data.list_ids && data.list_ids.length > 0) {
    return db
      .runTransaction(async (transaction: any) => {
        await ensureAllListsExistById(data.list_ids);
        await updatePromiseIdInLists({
          previousListIds: data.list_ids,
          promiseId: addResult.id,
          transaction,
          updatedListIds: [...data.list_ids, addResult.id]
        });
        return { id: addResult.id };
      })
      .catch((e: any) => {
        if (e.status) {
          return e;
        }
        throw e;
      });
  } else {
    return { id: addResult.id };
  }
};

export default add;
