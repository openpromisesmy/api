import _ from 'lodash';
import util from '../etc/utils';
import {
  create as createSchema,
  IPolitician,
  update as updateSchema
} from '../schemas/politician';
import db from '../services/db';
import contributorModel from './contributor';
import { AddReturn, ModelError, RefHead } from './types';

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

async function add(data: IPolitician): Promise<ModelError | AddReturn> {
  const con = await contributor.get(data.contributor_id, db);

  if (_.isEmpty(con)) {
    throw Error('Invalid Contributor');
  }

  const ref = await collection.add(data);

  if (_.isEmpty(ref)) {
    throw new Error('Fail to add');
  }

  return { id: ref.id };
}

async function get(id: string): Promise<IPolitician | {}> {
  const doc = await collection.doc(id).get();

  const politician = doc.data();

  if (_.isEmpty(politician) || politician == undefined) {
    return {};
  } else {
    return util.toObject(id, politician);
  }
}

interface Query {
  [key: string]: any;
}

async function list(query: Query) {
  let ref = collection;
  let head: RefHead = ref;
  if (!_.isEmpty(query)) {
    for (const x in query) {
      if (x === 'orderBy') {
        head = collection.orderBy(query[x], query.reverse ? 'desc' : 'asc');
      } else {
        head = collection.where(x, '==', query[x]);
      }
    }
  }

  const snapshot = await head.get();

  return util.snapshotToArray(snapshot);
}

async function update(id: string, updateData: object) {
  const politician = await get(id);

  if (_.isEmpty(politician)) {
    throw Error('Invalid Politician');
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
