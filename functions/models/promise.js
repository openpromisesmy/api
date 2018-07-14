const admin = require('firebase-admin');
const db = admin.firestore();
const joi = require('joi');
const _ = require('lodash');

const util = require('../etc/util');

const politicianModel = require('./politician');
const contributorModel = require('./contributor');

const politician = politicianModel();
const contributor = contributorModel();

const promiseStatusValues = [
  'Review Needed',
  'Fulfilled',
  'Broken',
  'Partially Fulfilled',
  'In Progress',
  'Not Started',
  'At Risk',
  'Retracted'
];

const createSchema = joi.object().keys({
  contributor_id: joi.string().required(),
  politician_id: joi.string().required(),
  source_date: joi
    .string()
    .isoDate()
    .required(),
  source_name: joi.string().required(),
  source_url: joi
    .string()
    .uri()
    .required(),
  cover_image: joi.string().uri(),
  post_url: joi.string(),
  category: joi.string(),
  title: joi.string().required(),
  quote: joi.string().required(),
  notes: joi.string(),
  status: joi
    .string()
    .allow(promiseStatusValues)
    .default('Review Needed'),
  live: joi.boolean().default(false),
  created_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of creation'),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update')
});

const updateSchema = joi.object().keys({
  contributor_id: joi.string(),
  politician_id: joi.string(),
  source_date: joi
    .string()
    .isoDate()
    .required(),
  source_name: joi.string(),
  source_url: joi.string().uri(),
  cover_image: joi.string().uri(),
  category: joi.string(),
  title: joi.string(),
  quote: joi.string(),
  notes: joi.string(),
  status: joi
    .string()
    .allow(promiseStatusValues)
    .default('Review Needed'),
  live: joi.boolean(),
  updated_at: joi
    .date()
    .iso()
    .default(util.now, 'Time of update'),
  post_url: joi.string()
});

const collection = db.collection('promises');

const add = data =>
  new Promise((resolve, reject) =>
    Promise.all([
      politician.get(data.politician_id),
      contributor.get(data.contributor_id)
    ])
      .then(([politician, contributor]) => {
        if (_.isEmpty(politician))
          return resolve({ status: 404, message: 'Invalid Politician' });

        if (_.isEmpty(contributor))
          return resolve({ status: 404, message: 'Invalid Contributor' });

        // @TODO: fix https://github.com/xjamundx/eslint-plugin-promise/issues/42
        return collection
          .add(data)
          .then(ref => {
            if (_.isEmpty(ref)) return reject(new Error('Fail to add'));
            return resolve({ id: ref.id });
          })
          .catch(e => {
            console.error(e);
            return reject(e);
          });
      })
      .catch(e => {
        if (e.status) return resolve(e);

        console.error(e);
        return reject(e);
      })
  );

const get = id =>
  new Promise((resolve, reject) =>
    collection
      .doc(id)
      .get()
      .then(doc => {
        const data = doc.data();
        const result = _.isEmpty(data) ? {} : util.toObject(id, data);

        return resolve(result);
      })
      .catch(e => {
        console.log(e);
        return reject(e);
      })
  );

const list = query =>
  new Promise((resolve, reject) => {
    const paginationQueries = ['pageSize', 'startAfter', 'orderBy', 'reverse'];
    let ref = collection;
    // apply ref modification when there are query params
    if (!_.isEmpty(query)) {
      for (let x in query) {
        if (paginationQueries.includes(x)) {
          // for pagination
          switch (x) {
            case 'pageSize':
              ref = ref.limit(Number(query[x]));
              break;
            case 'startAfter':
              ref = ref.startAfter(query[x]);
              break;
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
    ref
      .get()
      .then(snapshot => {
        return resolve(util.snapshotToArray(snapshot));
      })
      .catch(e => reject(e));
  });

const update = (id, updateData) =>
  new Promise((resolve, reject) =>
    get(id)
      .then(promise => {
        if (_.isEmpty(promise))
          return resolve({ status: 404, message: 'Invalid Promise' });

        // @TODO: fix https://github.com/xjamundx/eslint-plugin-promise/issues/42
        return collection
          .doc(id)
          .update(updateData)
          .then(d => resolve(d))
          .catch(e => reject(id));
      })
      .catch(e => {
        console.error(e);
        return reject(e);
      })
  );

const remove = id =>
  new Promise((resolve, reject) =>
    collection
      .doc(id)
      .delete()
      .then(() => resolve())
      .catch(e => {
        console.error(e);
        return reject(e);
      })
  );

const stats = () =>
  new Promise((resolve, reject) => {
    Promise.all([
      db
        .collection('promises')
        .where('live', '==', true)
        .select('politician_id', 'status')
        .get(),
      db
        .collection('politicians')
        .where('live', '==', true)
        .select('_id')
        .get()
    ])
      .then(servicesSnapshot => {
        const promises = util.snapshotToArray(servicesSnapshot[0]);
        const politicians = util.snapshotToArray(servicesSnapshot[1]);

        const livePromisesByLivePoliticians = filterPromisesWithLivePoliticians(
          promises,
          politicians
        );

        const statsByStatus = aggregateByStatus(livePromisesByLivePoliticians);

        return resolve(
          Object.assign(
            {},
            {
              count: livePromisesByLivePoliticians.length,
              allLivePromisesCount: promises.length
            },
            statsByStatus
          )
        );
      })
      .catch(e => reject(e));
  });

const promise = () => ({
  createSchema,
  updateSchema,
  list,
  get,
  add,
  update,
  remove,
  stats
});

module.exports = promise;

function filterPromisesWithLivePoliticians(promises, politicians) {
  return promises.reduce(
    (acc, p) =>
      politicians.find(pl => pl.id === p.politician_id)
        ? acc.concat(
            Object.assign({}, p, {
              status: p.status ? p.status : 'Review Needed'
            })
          )
        : acc,
    []
  );
}

function aggregateByStatus(livePromisesByLivePoliticians) {
  return _.countBy(livePromisesByLivePoliticians, 'status');
}
