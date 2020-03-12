import admin from 'firebase-admin';
import _ from 'lodash';
import util from '../etc/utils';
import {
  create as createSchema,
  IPolitician,
  update as updateSchema
} from '../schemas/politician';
import contributorModel from './contributor';

const db = admin.firestore();
// db.settings({ timestampsInSnapshots: true });
const contributor = contributorModel();
const collection = db.collection('politicians');

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

async function add(data: IPolitician) {
  const con = await contributor.get(data.contributor_id, admin.firestore());

  if (_.isEmpty(con)) {
    return { status: 404, message: 'Invalid Contributor' };
  }

  const ref = await collection.add(data);

  if (_.isEmpty(ref)) {
    throw new Error('Fail to add');
  }

  return { id: ref.id };
}

async function get(id: string) {
  const doc = await collection.doc(id).get();

  const coll = doc.data();

  return _.isEmpty(coll) ? {} : util.toObject(id, coll);
}

async function list(query: object) {
  let ref = collection;
  if (!_.isEmpty(query)) {
    for (const x in query) {
      if (x === 'orderBy') {
        ref = collection.orderBy(query[x], query.reverse ? 'desc' : 'asc');
      } else {
        ref = collection.where(x, '==', query[x]);
      }
    }
  }

  const snapshot = await ref.get();

  return util.snapshotToArray(snapshot);
}

async function update(id: string, updateData: object) {
  const politician = await get(id);

  if (_.isEmpty(politician)) {
    return { status: 404, message: 'Invalid Politicain' };
  }

  return collection.doc(id).update(updateData);
}

async function remove(id: string) {
  return collection.doc(id).delete();
}

async function stats() {
  const snapshot = await collection
    .where('live', '==', true)
    .select()
    .get();

  return { livePoliticians: snapshot.size };
}
