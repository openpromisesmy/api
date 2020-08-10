import admin from 'firebase-admin';
import _ from 'lodash';
import util from '../etc/utils';
import { snapshotToArray } from '../etc/utils';
import {
  create as createSchema,
  IContributor,
  update as updateSchema
} from '../schemas/contributor';

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

async function add(data: IContributor, db: admin.firestore.Firestore) {
  const ref = await db.collection('contributors').add(data);

  if (_.isEmpty(ref)) {
    throw new Error('Fail to add');
  }

  return { id: ref.id };
}

async function get(id: string, db: admin.firestore.Firestore) {
  const doc = await db
    .collection('contributors')
    .doc(id)
    .get();

  const data = doc.data();
  if (_.isEmpty(data) || data == undefined) {
    return {};
  } else {
    return util.toObject(id, data);
  }
}

interface MatchObject {
  [key: string]: any;
}

async function find(match: MatchObject, db: admin.firestore.Firestore) {
  const snapshot = await admin
    .database()
    .ref('/contributors')
    .orderByChild(Object.keys(match)[0])
    .equalTo(Object.keys(match).map(key => match[key][0])) // TODO: check whether this even works
    .once('value');

  const data = snapshot.val();
  const id = Object.keys(data)[0];
  const contributor = _.isEmpty(data) ? {} : util.toObject(id, data[id]);

  return contributor;
}

async function list(query: object, db: admin.firestore.Firestore) {
  const ref = _.isEmpty(query)
    ? db.collection('contributors')
    : db
        .collection('contributors')
        .where(util.getKey(query), '==', util.getValue(query));

  const snapshot = await ref.get();

  return snapshotToArray(snapshot);
}

async function update(
  id: string,
  updateData: IContributor,
  db: admin.firestore.Firestore
) {
  const contributor: IContributor = await get(id, db);

  if (_.isEmpty(contributor)) {
    return { status: 404, message: 'Invalid Contributor' };
  }

  return db
    .collection('contributors')
    .doc(id)
    .update(updateData);
}

async function remove(id: string, db: admin.firestore.Firestore) {
  return db
    .collection('contributors')
    .doc(id)
    .delete();
}

async function stats(db: admin.firestore.Firestore) {
  const snapshot = await db
    .collection('contributors')
    .select()
    .get();

  return { count: snapshot.size };
}
