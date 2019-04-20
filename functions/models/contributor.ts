import admin from 'firebase-admin';
import _ from 'lodash';
import util from '../etc/util';
import {
  create as createSchema,
  IContributor,
  update as updateSchema
} from '../schemas/contributor';

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });
const collection = db.collection('contributors');

export = () => ({
  add,
  createSchema,
  find,
  get,
  list,
  remove,
  stats,
  update,
  updateSchema
});

async function add(data: IContributor) {
  const ref = await collection.add(data);

  if (_.isEmpty(ref)) {
    throw new Error('Fail to add');
  }

  return { id: ref.id };
}

async function get(id: string) {
  const doc = await collection.doc(id).get();

  const data = doc.data();
  const contributor = _.isEmpty(data) ? {} : util.toObject(id, data);

  return contributor;
}

async function find(match: any) {
  const snapshot = await admin
    .database()
    .ref('/contributors')
    .orderByChild(Object.keys(match)[0])
    .equalTo(Object.keys(match).map(key => match[key][0]))
    .once('value');

  const data = snapshot.val();
  const id = Object.keys(data)[0];
  const contributor = _.isEmpty(data) ? {} : util.toObject(id, data[id]);

  return contributor;
}

async function list(query: object) {
  const ref = _.isEmpty(query)
    ? collection
    : collection.where(util.getKey(query), '==', util.getValue(query));

  const snapshot = await ref.get();

  return util.snapshotToArray(snapshot);
}

async function update(id: string, updateData: IContributor) {
  const contributor: IContributor = await get(id);

  if (_.isEmpty(contributor)) {
    return { status: 404, message: 'Invalid Contributor' };
  }

  return collection.doc(id).update(updateData);
}

async function remove(id: string) {
  return collection.doc(id).delete();
}

async function stats() {
  const snapshot = await collection.select().get();

  return { count: snapshot.size };
}
