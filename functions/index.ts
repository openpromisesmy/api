// import * as functions from 'firebase-functions';
import contributors from './api/contributors';
import lists from './api/lists';
import politicians from './api/politicians';
import promises from './api/promises';
import promiseUpdates from './api/promiseUpdate';
import stats from './api/stats';

export = {
  contributors,
  lists,
  politicians,
  promiseUpdates,
  promises,
  stats
};
