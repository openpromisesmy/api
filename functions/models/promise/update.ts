import _ from 'lodash';
import { IUpdatePromise } from '../../schemas/promise';
import admin from 'firebase-admin';

import {
  ensureAllListsExistById,
  updatePromiseIdInLists,
  collection,
  get
} from './index';

const update = (db: admin.firestore.Firestore) => async (
  id: string,
  data: IUpdatePromise
) => {
  const promise = await get(id);
  if (_.isEmpty(promise)) {
    throw Error('Invalid Promise');
  }
  // the lines below are so convoluted, we need to simplify them
  const previouslyNone = !promise.list_ids || promise.list_ids.length < 1;
  const previouslyHas = !previouslyNone;
  const updateHas = data.list_ids && data.list_ids.length > 0;
  const updateNone = !updateHas;
  const updateDoesNotInvolveListIds = !data.list_ids;

  if ((previouslyNone && updateNone) || updateDoesNotInvolveListIds) {
    return await db
      .collection('promises')
      .doc(id)
      .update(data);
  } else {
    return db
      .runTransaction(async (transaction: any) => {
        if (updateHas && data.list_ids != undefined) {
          await ensureAllListsExistById(data.list_ids);
        }

        await updatePromiseIdInLists({
          previousListIds: promise.list_ids,
          updatedListIds: data.list_ids,
          promiseId: id,
          transaction
        });

        return collection.doc(id).update(data);
      })
      .catch((e: any) => {
        if (e.status) {
          return e;
        }
        throw e;
      });
  }
};

export default update;
