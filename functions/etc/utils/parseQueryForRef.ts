import { CollectionReference } from '@google-cloud/firestore';
import _ from 'lodash';

const parseQueryForRef = (ref: CollectionReference, query: object) => {
  const paginationQueries = ['orderBy', 'reverse'];

  if (!_.isEmpty(query)) {
    for (const x in query) {
      if (paginationQueries.includes(x)) {
        // for pagination
        switch (x) {
          case 'orderBy':
            ref = ref.orderBy(query[x], query.reverse ? 'desc' : 'asc');
            break;
          default:
            break;
        }
      } else {
        // for other queries
        ref = ref.where(x, '==', query[x]);
      }
    }
  }

  return ref;
};

module.exports = parseQueryForRef;
