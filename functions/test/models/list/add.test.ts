/// <reference path="./types.d.ts" />
import FirebaseMock from 'mock-cloud-firestore';

import 'mocha';
import { expect } from 'chai';
import listFactory from '../../support/factories/list';
import add from '../../../models/list/add';

describe('the add method of the List model', () => {
  const record = listFactory.build();

  let db: any;

  beforeEach(() => {
    db = new FirebaseMock().firestore();
  });

  it('saves a list record to the database', async () => {
    await db
      .collection('lists')
      .get()
      .then((snapshot: any) => {
        expect(snapshot.size).to.equal(0);
      });

    await add(record, db);

    await db
      .collection('lists')
      .get()
      .then((snapshot: any) => {
        expect(snapshot.size).to.equal(1);
      });
  });

  it('returns the id', async () => {
    const result = await add(record, db);

    expect(result).to.contain.keys('id');
  });

  it('returns the id of the record in the database', async () => {
    const { id } = await add(record, db);
    const snapshot = await db
      .collection('lists')
      .doc(id)
      .get();

    expect(snapshot.data()).to.deep.equal(record);
  });
});
