/// <reference path="./types.d.ts" />
import FirebaseMock from 'mock-cloud-firestore';

import 'mocha';
import { expect } from 'chai';
import LeadModel from '../../../models/lead';

describe('the Lead model', () => {
  let db: any;

  beforeEach(() => {
    db = new FirebaseMock().firestore();
  });

  describe('the add method', () => {
    const validAttrs: any = {
      assigned_tracker: 'b5hqf73',
      created_at: '2019-05-20T13:14:41.489Z',
      link: 'https://example.org/foo/bar/quix',
      notes: 'Lorem Ipsum Dignitatum.',
      original_promise: 'fg4867',
      reviewed_by: 'g4342f',
      review_status: 'pending',
      submitter: 'f43g423',
      type: 'promise',
      updated_at: '2019-05-20T13:14:41.489Z'
    };

    it('creates a new lead in the database', async () => {
      const originalLeadCount = await getLeadCount();
      await LeadModel.add(validAttrs, db);
      expect(await getLeadCount()).to.equal(originalLeadCount + 1);
    });

    it('returns the id', async () => {
      const result = await LeadModel.add(validAttrs, db);
      expect(result).to.contain.keys('id');
    });

    it('returns the id of the record in the database', async () => {
      const { id } = await LeadModel.add(validAttrs, db);

      const snapshot = await db
        .collection('leads')
        .doc(id)
        .get();

      expect(snapshot.data()).to.deep.equal(validAttrs);
    });
  });

  async function getDocumentCount(collection: any): Promise<number> {
    return collection.get().then((snapshot: any) => snapshot.size);
  }

  async function getLeadCount(): Promise<number> {
    return getDocumentCount(db.collection('leads'));
  }
});
