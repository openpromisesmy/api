// returns an object with the values as key_names and an integer value that represents the operation
// 0 = no change, -1 = removed, 1 added
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
    return store[key] === 1;
  });

  const removals = Object.keys(store).filter(key => {
    return store[key] === -1;
  });

  return { additions, removals };
}

module.exports = detectArrayChanges;
