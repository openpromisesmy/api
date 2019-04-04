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
      contributor_id: '123',
      live: true,
      promise_ids: ['abc1', 'abc2', 'abc3'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      title: 'economics',
      contributor_id: '456',
      live: true,
      promise_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      title: 'public health',
      contributor_id: '123',
      live: true,
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

    expect(docs).to.have.deep.members(
      (() => recordRefs.map((ref, i) => ({ id: ref.id, ...records[i] })))()
    );
  });

  it('queries lists based on the "live" field if specified', async () => {
    const nonLiveLists = [
      {
        title: 'public health',
        contributor_id: '123',
        live: false,
        promise_ids: ['bcd4'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        title: 'public safety',
        contributor_id: '456',
        live: false,
        promise_ids: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const nonLiveListRefs = await Promise.all(
      nonLiveLists.map(record => db.collection('lists').add(record))
    );

    const docs = await list({ live: false }, db);

    expect(docs).to.have.deep.members(
      nonLiveListRefs.map((ref, i) => ({ id: ref.id, ...nonLiveLists[i] }))
    );
  });
});
