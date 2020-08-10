import { DocumentData } from '@google-cloud/firestore';
import _ from 'lodash';
import util from '../etc/utils';
import {
  create as createSchema,
  IPromiseUpdate,
  update as updateSchema
} from '../schemas/promiseUpdate';
import db from '../services/db';
import PromiseModel from './promise';

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

async function get(id: string): Promise<DocumentData> {
  const doc = await collection.doc(id).get();
  const data = doc.data();
  if (data === undefined) {
    return {};
  } else {
    return util.toObject(id, data);
  }
}

// add in query for promise_id, and source_date (asc)
async function list(query: object): Promise<DocumentData[]> {
  const ref = util.parseQueryForRef(collection, query);

  const snapshot = await ref.get();

  return util.snapshotToArray(snapshot);
}

async function update(id: string, data: DocumentData): Promise<DocumentData> {
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
  if (latestUpdate === undefined) {
    return;
  } else {
    const latestStatus = latestUpdate.status;
    return PromiseModel.update(promiseId, { status: latestStatus });
  }
}
