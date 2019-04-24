import { CollectionReference } from '@google-cloud/firestore';
import _ from 'lodash';

const parseQueryForRef = (ref: CollectionReference, query: any) => {
  const paginationQueries = ['orderBy', 'reverse'];
  let result: any = ref;

  if (!_.isEmpty(query)) {
    for (const x in query) {
      if (paginationQueries.includes(x)) {
        // for pagination
        switch (x) {
          case 'orderBy':
            result = result.orderBy(query[x], query.reverse ? 'desc' : 'asc');
            break;
          default:
            break;
        }
      } else {
        // for other queries
        result = result.where(x, '==', query[x]);
      }
    }
  }

  return result;
};

module.exports = parseQueryForRef;
