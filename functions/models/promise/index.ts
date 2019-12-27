import admin from 'firebase-admin';
import _ from 'lodash';
import { snapshotToArray } from '../../etc/utils';
import {
  create as createSchema,
  update as updateSchema
} from '../../schemas/promise';
import add from './add';
import update from './update';
import list from './list';
import get from './get';
import { detectArrayChanges } from '../../etc/utils';

const db = admin.firestore();
// db.settings({ timestampsInSnapshots: true });

export const collection = db.collection('promises');

export default {
  add: add(db),
  db,
  createSchema,
  get: get(db),
  list: list(db),
  remove,
  stats,
  update: update(db),
  updateSchema,
  ensurePoliticianExistsById,
  ensureContributorExistsById,
  ensureAllListsExistById,
  updatePromiseIdInLists
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

  const updatedPromiseIds = promiseIds.filter((x: string) => x !== promiseId);

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

interface IUpdatePromiseIdInListsParam {
  previousListIds: string[];
  updatedListIds: string[];
  promiseId: string;
  transaction: any;
}

export async function updatePromiseIdInLists({
  previousListIds,
  updatedListIds,
  promiseId,
  transaction
}: IUpdatePromiseIdInListsParam) {
  const { additions, removals } = detectArrayChanges(
    previousListIds,
    updatedListIds
  );

  const additionOps = additions.map((listId: string) => {
    return findByListIdAndAddPromiseId(listId, promiseId, transaction);
  });

  const removalOps = removals.map((listId: string) => {
    return findByListIdAndRemovePromiseId(listId, promiseId, transaction);
  });

  return Promise.all([...additionOps, ...removalOps]);
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
  promises: admin.firestore.DocumentData[],
  politicians: admin.firestore.DocumentData[]
) {
  return promises.reduce(
    (acc: object[], p: admin.firestore.DocumentData) =>
      politicians.find(
        (pl: admin.firestore.DocumentData) => pl.id === p.politician_id
      )
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
