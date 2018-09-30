import admin from 'firebase-admin';

import functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);

import contributors from './api/contributors';
import politicians from './api/politicians';
import promises from './api/promises';
import promiseUpdates from './api/promiseUpdate';
import stats from './api/stats';

export = {
  contributors,
  politicians,
  promiseUpdates,
  promises,
  stats
};
