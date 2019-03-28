import { IPromise } from '../../schemas/promise';
import {
  ensurePoliticianExistsById,
  ensureContributorExistsById,
  ensureAllListsExistById,
  findAllListsByIdAndAddPromiseId
} from './index';

const add = db => async (data: IPromise) => {
  await ensurePoliticianExistsById(data.politician_id);
  await ensureContributorExistsById(data.contributor_id);
  const addResult = await db.collection('promises').add(data);

  if (data.list_ids && data.list_ids.length > 0) {
    return db
      .runTransaction(async (transaction: any) => {
        await ensureAllListsExistById(data.list_ids);
        await findAllListsByIdAndAddPromiseId(
          data.list_ids,
          addResult.id,
          transaction
        );
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
