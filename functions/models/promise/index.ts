import admin from 'firebase-admin';
import _ from 'lodash';
import { detectArrayChanges, snapshotToArray, toObject } from '../../etc/utils';
import {
  create as createSchema,
  IPromise,
  update as updateSchema
} from '../../schemas/promise';
import contributorModel from '../contributor';
import politicianModel from '../politician';
import add from './add';

const db = admin.firestore();
const politician = politicianModel();
const contributor = contributorModel();

const collection = db.collection('promises');

export default {
  add: add(db),
  createSchema,
  get,
  list,
  remove,
  stats,
  update,
  updateSchema,
  ensurePoliticianExistsById,
  ensureContributorExistsById,
  ensureAllListsExistById,
  findAllListsByIdAndAddPromiseId
};

async function getListIdIfInvalid(listId: string): Promise<undefined | string> {
  const listRef = db.collection('lists').doc(listId);
  const snapshot = await listRef.get();

  if (snapshot.exists) {
    return undefined;
  }

  return listId;
}

async function findByListIdAndAddPromiseId(
  listId: string,
  promiseId: string,
  transaction: any
): Promise<undefined> {
  const listRef = db.collection('lists').doc(listId);
  const snapshot = await transaction.get(listRef);

  const { promise_ids: promiseIds } = snapshot.data();

  transaction.update(listRef, {
    promise_ids: promiseIds.concat(promiseId)
  });

  return undefined;
}

export async function ensurePoliticianExistsById(politicianId: string) {
  const politicianRef = db.collection('politicians').doc(politicianId);

  return politicianRef.get().then((thisPolitician: any) => {
    if (thisPolitician.exists) {
      return;
    }
    throw { status: 404, message: 'Invalid Politician' };
  });
}

export async function ensureContributorExistsById(contributorId: string) {
  const contributorRef = db.collection('contributors').doc(contributorId);

  return contributorRef.get().then((thisContributor: any) => {
    if (thisContributor.exists) {
      return;
    }
    throw { status: 404, message: 'Invalid Contributor' };
  });
}

export async function ensureAllListsExistById(listIds: string[]) {
  const validations = listIds.map(getListIdIfInvalid);

  return Promise.all(validations).then(thisListIds => {
    const [invalidId] = thisListIds.filter(id => id !== undefined);

    if (invalidId) {
      throw {
        message: `Invalid List with id "${invalidId}"`,
        status: 404
      };
    }
  });
}

export async function findAllListsByIdAndAddPromiseId(
  listIds: string[],
  promiseId: string,
  transaction: any
) {
  const updates = listIds.map(listId => {
    return findByListIdAndAddPromiseId(listId, promiseId, transaction);
  });

  return Promise.all(updates);
}

async function get(id: string) {
  const doc = await collection.doc(id).get();

  const promise = doc.data();

  return _.isEmpty(promise) ? {} : toObject(id, promise);
}

async function list(query: object) {
  let ref = collection;
  if (!_.isEmpty(query)) {
    _.forIn(query, (value: any, key: string) => {
      switch (key) {
        case 'pageSize':
          ref = ref.limit(Number(value));
          break;
        case 'startAfter':
          ref = ref.startAfter(value);
          break;
        case 'orderBy':
          ref = ref.orderBy(value, query.reverse ? 'desc' : 'asc');
          break;
        case 'reverse':
          break;
        default:
          ref = ref.where(key, '==', value);
          break;
      }
    });
  }

  const snapshot = await ref.get();
  return snapshotToArray(snapshot);
}

async function update(id: string, data: IPromise) {
  return db
    .runTransaction(async (transaction: any) => {
      const promise = await get(id);
      const previouslyNoListIds =
        !promise.list_ids || promise.list_ids.length < 1;
      const previouslyHasListIds = !previouslyNoListIds;
      const updateHasListIds = data.list_ids && data.list_ids.length > 0;
      const updateDoesNotHaveListIds = !updateHasListIds;

      if (updateHasListIds) {
        await ensureAllListsExistById(data.list_ids);
      }

      if (previouslyNoListIds && updateHasListIds) {
        console.log('just update Lists with this promise_id');
        await findAllListsByIdAndAddPromiseId(data.list_ids, id, transaction);
      }
      if (previouslyHasListIds && updateDoesNotHaveListIds) {
        console.log('remove promise_id from all List');
      }
      if (previouslyHasListIds && updateHasListIds) {
        const change = detectArrayChanges(promise.list_ids, data.list_ids);
        console.log(change);
      }

      if (_.isEmpty(promise)) {
        return { status: 404, message: 'Invalid Promise' };
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

async function remove(id: string) {
  return collection.doc(id).delete();
}

async function stats() {
  const servicesSnapshot = await Promise.all([
    db
      .collection('promises')
      .where('live', '==', true)
      .select('politician_id', 'status')
      .get(),
    db
      .collection('politicians')
      .where('live', '==', true)
      .select('_id')
      .get()
  ]);

  const promises = snapshotToArray(servicesSnapshot[0]);
  const politicians = snapshotToArray(servicesSnapshot[1]);

  const livePromisesByLivePoliticians = _filterPromisesWithLivePoliticians(
    promises,
    politicians
  );

  const statsByStatus = _aggregateByStatus(livePromisesByLivePoliticians);

  return {
    countByStatus: statsByStatus,
    livePromises: promises.length,
    livePromisesByLivePoliticians: livePromisesByLivePoliticians.length
  };
}

function _filterPromisesWithLivePoliticians(
  promises: object[],
  politicians: object[]
) {
  return promises.reduce(
    (acc: object[], p: object) =>
      politicians.find((pl: object) => pl.id === p.politician_id)
        ? acc.concat(
            Object.assign({}, p, {
              status: p.status ? p.status : 'Review Needed'
            })
          )
        : acc,
    []
  );
}

function _aggregateByStatus(livePromisesByLivePoliticians: object[]) {
  return _.countBy(livePromisesByLivePoliticians, 'status');
}
