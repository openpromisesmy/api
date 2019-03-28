import { IPromise } from '../../schemas/promise';
import {
  ensurePoliticianExistsById,
  ensureContributorExistsById,
  ensureAllListsExistById,
  findAllListsByIdAndAddPromiseId
} from './index';

const add = db => async (data: IPromise) => {
  console.log(data);
  return db
    .runTransaction(async (transaction: any) => {
      await ensurePoliticianExistsById(data.politician_id);
      await ensureContributorExistsById(data.contributor_id);
      const ref = db.collection('promises').doc();
      transaction.update(ref, data);
      await ensureAllListsExistById(data.list_ids);
      await findAllListsByIdAndAddPromiseId(data.list_ids, ref.id, transaction);
      return { id: ref.id };
    })
    .catch((e: any) => {
      if (e.status) {
        return e;
      }
      throw e;
    });
};

export default add;
