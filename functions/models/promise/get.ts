import admin = require('firebase-admin');
import _ from 'lodash';
import utils from '../../etc/utils';

const get = (db: admin.firestore.Firestore) => async (id: string) => {
  const doc = await db
    .collection('promises')
    .doc(id)
    .get();

  const promise = doc.data();

  if (_.isEmpty(promise) || promise == undefined) {
    return {};
  } else {
    return utils.toObject(id, promise);
  }
};

export default get;
