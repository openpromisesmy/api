'use strict';
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const now = () => new Date().toISOString();
const toArray = fireObj =>
  Object.keys(fireObj).reduce(
    (acc, key) => acc.concat(Object.assign({}, fireObj[key], { id: key })),
    []
  );
const toObject = (id, fireObj) => Object.assign({}, fireObj, { id });
const getKey = obj => Object.keys(obj)[0];
const getValue = obj => obj[getKey(obj)];
const snapshotToArray = snapshot => {
  const array = [];
  snapshot.forEach(doc => {
    array.push(toObject(doc.id, doc.data()));
  });
  return array;
};
const promisify = (f, ...params) => {
  return new Promise((resolve, reject) => {
    f(...params, (e, result) => {
      if (e) {
        return reject(e);
      }
      return resolve(result);
    });
  });
};
module.exports = {
  compose,
  getKey,
  getValue,
  now,
  promisify,
  snapshotToArray,
  toArray,
  toObject
};
