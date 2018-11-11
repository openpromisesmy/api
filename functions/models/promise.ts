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

async function add(data: IPromise) {
  try {
    const [pol, con] = await Promise.all([
      politician.get(data.politician_id),
      contributor.get(data.contributor_id)
    ]);

    if (_.isEmpty(pol)) {
      return { status: 404, message: 'Invalid Politician' };
    }

    if (_.isEmpty(con)) {
      return { status: 404, message: 'Invalid Contributor' };
    }

    const ref = await collection.add(data);

    if (_.isEmpty(ref)) {
      throw new Error('Fail to add');
    }

    return { id: ref.id };
  } catch (e) {
    if (e.status) {
      return e;
    }

    throw e;
  }
}

async function get(id: string) {
  const doc = await collection.doc(id).get();

  const promise = doc.data();

  return _.isEmpty(promise) ? {} : util.toObject(id, promise);
}

async function list(query: object) {
  let ref = collection;

  // apply ref modification when there are query params
  if (!_.isEmpty(query)) {
    _.forIn(query, (value: any, key: string) => {
      switch (key) {
        case 'pageSize':
          ref = collection.limit(Number(value));
          break;
        case 'startAfter':
          ref = collection.startAfter(value);
          break;
        case 'orderBy':
          ref = collection.orderBy(value, query.reverse ? 'desc' : 'asc');
          break;
        default:
          ref = collection.where(key, '==', value);
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
