import admin from 'firebase-admin';
import _ from 'lodash';
import util from '../etc/util';
import {
  create as createSchema,
  IPromise,
  update as updateSchema
} from '../schemas/promise';
import contributorModel from './contributor';
import politicianModel from './politician';

const db = admin.firestore();
const politician = politicianModel();
const contributor = contributorModel();

const collection = db.collection('promises');

export = () => ({
  add,
  createSchema,
  get,
  list,
  remove,
  stats,
  update,
  updateSchema
});

async function getListIdIfInvalid(listId: string): Promise<undefined | string> {
  const list = db.collection('lists').doc(listId);
  const snapshot = await list.get();

  if (snapshot.exists) return undefined;

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

async function ensurePoliticianExistsById(politicianId: string) {
  const politicianRef = db.collection('politicians').doc(politicianId);

  return politicianRef.get().then((politician: any) => {
    if (politician.exists) return;
    throw { status: 404, message: 'Invalid Politician' };
  });
}

async function ensureContributorExistsById(contributorId: string) {
  const contributorRef = db.collection('contributors').doc(contributorId);

  return contributorRef.get().then((contributor: any) => {
    if (contributor.exists) return;
    throw { status: 404, message: 'Invalid Contributor' };
  });
}

async function ensureAllListsExistById(listIds: string[]) {
  const validations = listIds.map(getListIdIfInvalid);

  return Promise.all(validations).then(listIds => {
    const [invalidId] = listIds.filter(id => id !== undefined);

    if (invalidId) {
      throw {
        status: 404,
        message: `Invalid List with id "${invalidId}"`
      };
    }
  });
}

async function findAllListsByIdAndAddPromiseId(
  listIds: string[],
  promiseId: string,
  transaction: any
) {
  const updates = listIds.map(listId => {
    return findByListIdAndAddPromiseId(listId, promiseId, transaction);
  });

  return Promise.all(updates);
}

async function add(data: IPromise) {
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
      if (e.status) return e;

      throw e;
    });
}

async function get(id: string) {
  const doc = await collection.doc(id).get();

  const promise = doc.data();

  return _.isEmpty(promise) ? {} : util.toObject(id, promise);
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
  return util.snapshotToArray(snapshot);
}

async function update(id: string, updateData: object) {
  const promise = await get(id);

  if (_.isEmpty(promise)) {
    return { status: 404, message: 'Invalid Promise' };
  }

  return collection.doc(id).update(updateData);
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

  const promises = util.snapshotToArray(servicesSnapshot[0]);
  const politicians = util.snapshotToArray(servicesSnapshot[1]);

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
