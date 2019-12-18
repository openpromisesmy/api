import add from './add';
import update from './update';
import get from './get';
import list from './list';
import admin from 'firebase-admin';
const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export = () => ({
  add: add(db),
  update: update(db),
  get: get(db),
  list: list(db)
});
