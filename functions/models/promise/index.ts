import admin from 'firebase-admin';
import _ from 'lodash';
import { snapshotToArray, toObject } from '../../etc/utils';
import {
  create as createSchema,
  update as updateSchema
} from '../../schemas/promise';
import contributorModel from '../contributor';
import politicianModel from '../politician';
import add from './add';
import update from './update';

export const db = admin.firestore();
const politician = politicianModel();
const contributor = contributorModel();

export const collection = db.collection('promises');

export default {
  add: add(db),
  createSchema,
  get,
  list,
  remove,
  stats,
  update: update(db),
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

async function findByListIdAndRemovePromiseId(
  listId: string,
  promiseId: string,
  transaction: any
): Promise<undefined> {
  const listRef = db.collection('lists').doc(listId);
  const snapshot = await transaction.get(listRef);

  const { promise_ids: promiseIds } = snapshot.data();

  const updatedPromiseIds = promiseIds.filter(x => x !== promiseId);

  transaction.update(listRef, {
    promise_ids: updatedPromiseIds
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

export async function get(id: string) {
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
