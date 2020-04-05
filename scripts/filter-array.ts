import config from './config';

let { KEY_TO_CHECK } = config.FILTER;

// warning: this does not care which duplicate it gets
function getDuplicatesOfArray(array) {
  let countStore = {};
  let duplicates = [];
  array.forEach(item => {
    const storeKey = item[KEY_TO_CHECK];
    if (countStore[storeKey] === undefined) {
      countStore[storeKey] = 1;
    } else if (countStore[storeKey] >= 1) {
      countStore[storeKey]++;
      duplicates.push(item);
    }
  });
  return duplicates;
}

function filterArray(array) {
  const result = getDuplicatesOfArray(array);
  return result;
}

export default filterArray;
