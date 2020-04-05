'use strict';
const toObject = (id, fireObj) =>
  Object.assign(Object.assign({}, fireObj), { id });
const snapshotToArray = snapshot => {
  const array = [];
  snapshot.forEach(doc => {
    array.push(toObject(doc.id, doc.data()));
  });
  return array;
};
module.exports = { snapshotToArray };
//# sourceMappingURL=utils.js.map
