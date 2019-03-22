/// <reference path="./types.d.ts" />
import FirebaseMock from 'mock-cloud-firestore';

import 'mocha';
import { expect } from 'chai';
import { IList } from '../../../schemas/list';
import list from '../../../models/list/list';

describe('the list method of the List model', () => {
  const records: Array<IList> = [
    {
      title: 'public safety',
      promise_ids: ['abc1', 'abc2', 'abc3'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      title: 'economics',
      promise_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      title: 'public health',
      promise_ids: ['bcd4'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  let db: any;
  let recordRefs: Array<any>;

  beforeEach(async () => {
    db = new FirebaseMock().firestore();

    const additions = records.map(record => db.collection('lists').add(record));

    recordRefs = await Promise.all(additions);
  });

  it('returns a list of List docs', async () => {
    const docs = await list({}, db);

    expect(docs).to.deep.include.members(
      (() => recordRefs.map((ref, i) => ({ id: ref.id, ...records[i] })))()
    );
  });
});
