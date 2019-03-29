const ITEM_ADDED = 1;
const ITEM_REMOVED = -1;

function detectArrayChanges(originalArr = [], updatedArr) {
  const store = {};
  originalArr.forEach(item => {
    store[item] = -1;
  });
  updatedArr.forEach(item => {
    if (store[item]) {
      store[item]++;
    } else {
      store[item] = 1;
    }
  });

  const additions = Object.keys(store).filter(key => {
    return store[key] === ITEM_ADDED;
  });

  const removals = Object.keys(store).filter(key => {
    return store[key] === ITEM_REMOVED;
  });

  return { additions, removals };
}

module.exports = detectArrayChanges;
