/// <reference path="./types.d.ts" />
import FirebaseMock from 'mock-cloud-firestore';

import 'mocha';
import { expect } from 'chai';
import { IList } from '../../../schemas/list';
import get from '../../../models/list/get';

describe('the get method of the List model', () => {
  const record: IList = {
    title: 'public safety',
    promise_ids: ['abc1', 'abc2', 'abc3'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let db: any;
  let recordRef: any;

  beforeEach(async () => {
    db = new FirebaseMock().firestore();
    db.settings({ timestampsInSnapshots: true });
    recordRef = await db.collection('lists').add(record);
  });

  it('gets the List doc with the given id from the db', async () => {
    const result = await get(recordRef.id, db);
    expect(result).to.deep.equal(record);
  });

  it('returns undefined if no doc with the given id exists', async () => {
    const result = await get('123', db);
    expect(result).to.be.undefined;
  });
});
