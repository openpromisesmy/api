import _ from 'lodash';
import { detectArrayChanges } from '../../etc/utils';
import { IPromise } from '../../schemas/promise';
import {
  db,
  get,
  ensureAllListsExistById,
  findAllListsByIdAndAddPromiseId,
  collection
} from './index';

const update = db => async (id: string, data: IPromise) => {
  const promise = await get(id);
  if (_.isEmpty(promise)) {
    return { status: 404, message: 'Invalid Promise' };
  }
  const previouslyNone = !promise.list_ids || promise.list_ids.length < 1;
  const previouslyHas = !previouslyNone;
  const updateHas = data.list_ids && data.list_ids.length > 0;
  const updateNone = !updateHas;

  if (previouslyNone && updateNone) {
    return await db
      .collection('promises')
      .doc(id)
      .update(data);
  } else {
    return db
      .runTransaction(async (transaction: any) => {
        if (updateHas) {
          await ensureAllListsExistById(data.list_ids);
        }

        const change = detectArrayChanges(promise.list_ids, data.list_ids);
        console.log(change);

        if (previouslyNone && updateHas) {
          console.log('just update Lists with this promise_id');
          await findAllListsByIdAndAddPromiseId(data.list_ids, id, transaction);
        }
        if (previouslyHas && updateNone) {
          console.log('remove promise_id from all List');
        }
        if (previouslyHas && updateHas) {
        }
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
