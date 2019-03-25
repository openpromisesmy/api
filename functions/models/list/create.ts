import admin from 'firebase-admin';

import { IList } from '../../schemas/list';

type Firestore = admin.firestore.Firestore;
type DocumentReference = admin.firestore.DocumentReference;
type DocumentSnapshot = admin.firestore.DocumentSnapshot;
type DocumentData = admin.firestore.DocumentData;

async function create(
  data: IList,
  dbOverride?: Firestore
): Promise<{ id: string }> {
  try {
    const db = dbOverride || admin.firestore();

    const ref = await db.runTransaction(async transaction => {
      const listRef = db.collection('lists').doc();

      transaction.update(listRef, data);

      const promiseRefs = await Promise.all(
        data.promise_ids.map(async promiseId =>
          db.collection('promises').doc(promiseId)
        )
      );

      await addListToPromises(promiseRefs, listRef, transaction);

      return listRef;
    });

    return { id: ref.id };
  } catch (e) {
    throw e;
  }
}

async function addListToPromises(
  promiseRefs: DocumentReference[],
  listRef: DocumentReference,
  transaction: any /* admin.firestore.Transaction */
): Promise<any> {
  return Promise.all(promiseRefs.map(addListToPromise));

  async function addListToPromise(promiseRef: DocumentReference) {
    return new Promise((resolve, reject) => {
      transaction
        .get(promiseRef)
        .then(throwIfNoPromiseExists)
        .then(addListId)
        .then(() => resolve())
        .catch(reject);
    });

    async function throwIfNoPromiseExists(
      snapshot: DocumentSnapshot
    ): Promise<undefined> {
      if (snapshot.exists) return undefined;

      throw new Error(
        `Promise with id "${promiseRef.id}" does` +
          ' not exist. This error should not normally occur.' +
          ' Please make sure you are validating input properly.'
      );
    }

    async function addListId() {
      const snapshot = await transaction.get(promiseRef);

      const doc = snapshot.data();
      const listIds = (doc as admin.firestore.DocumentData).list_ids;

      transaction.update(promiseRef, { list_ids: listIds.concat(listRef.id) });
    }
  }
}

export default create;
