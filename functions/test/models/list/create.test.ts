/// <reference path="./types.d.ts" />
import FirebaseMock from 'firebase-mock';

import 'mocha';
import { expect } from 'chai';
import { IList } from '../../../schemas/list';
import { IPromise } from '../../../schemas/promise';
import create from '../../../models/list/create';

describe('the create method of the List model', () => {
  const record: IList = {
    contributor_id: '789',
    title: 'public safety',
    promise_ids: [],
    live: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const promise: IPromise = {
    contributor_id: '123',
    politician_id: '-L5o5YwQa-jgdt_4sPqe',
    source_date: '2018-03-03T16:20:01.072Z',
    source_name: 'Bernama',
    source_url: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md',
    cover_image: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md',
    category: 'potato',
    title: 'Promising promises',
    quote: '"...potato said potata"',
    status: 'In review',
    live: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    list_ids: []
  };

  const anotherPromise: IPromise = {
    contributor_id: '456',
    politician_id: '-L5o5YwQa-jgdt_4sPqe',
    source_date: '2018-03-03T16:20:01.072Z',
    source_name: 'Bernama',
    source_url: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md',
    cover_image: 'https://github.com/hapijs/joi/blob/v13.1.2/API.md',
    category: 'tomato',
    title: 'Promising tomatoes',
    quote: '"...tomato said tomata"',
    status: 'In review',
    live: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    list_ids: []
  };

  let db: any;

  beforeEach(() => {
    db = new FirebaseMock.MockFirestore();

    db.autoFlush();
  });

  it('saves a list record to the database', async () => {
    await db
      .collection('lists')
      .get()
      .then((snapshot: any) => {
        expect(snapshot.size).to.equal(0);
      });

    await create(record, db);

    await db
      .collection('lists')
      .get()
      .then((snapshot: any) => {
        expect(snapshot.size).to.equal(1);
      });
  });

  it('returns the id', async () => {
    const result = await create(record, db);

    expect(result).to.contain.keys('id');
  });

  it('returns the id of the record in the database', async () => {
    const { id } = await create(record, db);
    const snapshot = await db
      .collection('lists')
      .doc(id)
      .get();

    expect(snapshot.data()).to.deep.equal(record);
  });

  it('updates the "list_ids" field of the added promise', async () => {
    const promiseRef = await db.collection('promises').add(promise);

    const anotherPromiseRef = await db
      .collection('promises')
      .add(anotherPromise);

    const { id } = await create(
      {
        ...record,
        promise_ids: [promiseRef.id, anotherPromiseRef.id]
      },
      db
    );

    const snapshot = await db
      .collection('promises')
      .doc(promiseRef.id)
      .get();

    expect(snapshot.data()).to.deep.equal({
      ...promise,
      list_ids: [id]
    });

    const anotherSnapshot = await db
      .collection('promises')
      .doc(anotherPromiseRef.id)
      .get();

    expect(anotherSnapshot.data()).to.deep.equal({
      ...anotherPromise,
      list_ids: [id]
    });
  });

  it('throws an error if no promise exists with the id', done => {
    const badId = 'abcdefgh';

    create({ ...record, promise_ids: [badId] }, db)
      .then(() => done(new Error('Expected an error to be thrown.')))
      .catch(err => {
        try {
          expect(err).to.be.instanceOf(Error);

          expect(err.message).to.match(
            new RegExp(`Promise with id "${badId}" does not exist`)
          );

          done();
        } catch (err) {
          done(err);
        }
      });
  });

  it('does not create a list if an error is thrown', done => {
    const badId = 'abcdefgh';

    create({ ...record, promise_ids: [badId] }, db)
      .then(() => done(new Error('Expected an error to be thrown.')))
      .catch(() => {
        db
          .collection('lists')
          .get()
          .then((snapshot: any) => {
            expect(snapshot.size).to.equal(0);

            done();
          })
          .catch(done);
      });
  });

  it('does not update promises if an error is thrown', done => {
    const badId = 'abcdefgh';

    db
      .collection('promises')
      .add(promise)
      .then((promiseRef: any) => {
        const promiseIds = [promiseRef.id, badId];

        return create({ ...record, promise_ids: promiseIds }, db)
          .then(() => done(new Error('Expected an error to be thrown.')))
          .catch(() =>
            db
              .collection('promises')
              .get()
              .then((snapshot: any) => {
                expect(snapshot.size).to.equal(1);
              })
              .then(() => {
                return db
                  .collection('promises')
                  .doc(promiseRef.id)
                  .get();
              })
              .then((snapshot: any) => {
                const actualPromise = snapshot.data();

                if (!actualPromise) {
                  throw new Error(
                    'This test example violates the' +
                      ' pre-condition: the promise has to exist in the database'
                  );
                }

                expect(actualPromise).to.deep.equal(promise);

                done();
              })
              .catch(done)
          );
      })
      .catch(done);
  });
});
