/// <reference path="./types.d.ts" />
import FirebaseMock from 'mock-cloud-firestore';

import 'mocha';
import { expect } from 'chai';
import add from '../../../models/promise/add';

describe.only('the add method of the Add Promise', () => {
  let db: any;

  beforeEach(() => {
    db = new FirebaseMock().firestore();
  });

  it('should successfully add promise', async () => {
    await db
      .collection('promises')
      .get()
      .then((snapshot: any) => {
        expect(snapshot.size).to.equal(0);
      });

    const addDB = add(db);
    await addDB({
      contributor_id: '8354a',
      created_at: new Date().toISOString(),
      list_ids: [],
      live: true,
      politician_id: '6j434',
      quote: 'Alea iacta est',
      source_date: new Date().toISOString(),
      source_name: 'Gallic Times',
      source_url: 'https://google.com',
      status: 'test',
      title: 'Lowering tax rate 5%',
      updated_at: new Date().toISOString()
    });

    await db
      .collection('lists')
      .get()
      .then((snapshot: any) => {
        expect(snapshot.size).to.equal(1);
      });
  });
});
