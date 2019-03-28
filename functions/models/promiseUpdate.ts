import admin from 'firebase-admin';
import _ from 'lodash';
import util from '../etc/util';
import {
  create as createSchema,
  IPromiseUpdate,
  update as updateSchema
} from '../schemas/promiseUpdate';
import PromiseModel from './promise';

const db = admin.firestore();

const collection = db.collection('promiseUpdates');

export = () => ({
  add,
  createSchema,
  get,
  list,
  remove,
  update,
  updateSchema
});

async function add(data: IPromiseUpdate) {
  try {
    const pro = await PromiseModel.get(data.promise_id);

    if (_.isEmpty(pro)) {
      return { status: 404, message: 'Invalid Promise' };
    }

    const ref = await collection.add(data);

    if (_.isEmpty(ref)) {
      throw new Error('Failed to add');
    }

    await updateSourcePromiseStatus(data.promise_id);

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
  const data = doc.data();

  return _.isEmpty(data) ? {} : util.toObject(id, data);
}

// add in query for promise_id, and source_date (asc)
async function list(query: object) {
  const ref = util.parseQueryForRef(collection, query);

  const snapshot = await ref.get();

  return util.snapshotToArray(snapshot);
}

async function update(id: string, data: object) {
  const promiseUpdate = await get(id);

  if (_.isEmpty(promiseUpdate)) {
    return { status: 404, message: 'Invalid Promise Update' };
  }

  const [updatedPromise] = await Promise.all([
    collection.doc(id).update(data),
    updateSourcePromiseStatus(data.promise_id)
  ]);

  return updatedPromise;
}

async function remove(id: string) {
  return collection.doc(id).delete();
}

async function updateSourcePromiseStatus(promiseId: string) {
  const promiseUpdates = await list({
    orderBy: 'source_date',
    promise_id: promiseId
  });

  const latestUpdate = _.last(promiseUpdates);
  const latestStatus = latestUpdate.status;

  return PromiseModel.update(promiseId, { status: latestStatus });
}
