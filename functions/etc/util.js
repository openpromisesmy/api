const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const now = () => new Date().toISOString();
const toArray = fireObj =>
  Object.keys(fireObj).reduce(
    (acc, key) => acc.concat(Object.assign({ id: key }, fireObj[key])),
    []
  );
const toObject = (id, fireObj) => Object.assign({ id }, fireObj);
const getKey = obj => Object.keys(obj)[0];
const getValue = obj => obj[getKey(obj)];
const snapshotToArray = snapshot => {
  const array = [];
  snapshot.forEach(doc => {
    array.push(toObject(doc.id, doc.data()));
  });
  return array;
};

module.exports = {
  compose,
  now,
  toArray,
  toObject,
  getKey,
  getValue,
  snapshotToArray
};
