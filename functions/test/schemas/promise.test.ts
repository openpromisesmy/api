import 'mocha';
import { expect } from 'chai';

import {
  create as createSchema,
  update as updateSchema
} from '../../schemas/promise';

describe('promise schema', () => {
  describe('create', () => {
    const attrs = {
      contributor_id: '8354a',
      politician_id: '6j434',
      quote: 'Alea iacta est',
      source_date: new Date().toISOString(),
      source_name: 'Gallic Times',
      source_url: 'https://google.com',
      title: 'Lowering tax rate 5%'
    };

    it('expects the "list_ids" field to be an array', done => {
      createSchema
        .validate({ ...attrs, list_ids: 1234 })
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"list_ids" must be an array');

          done();
        })
        .catch(done);
    });

    it('expects the "list_ids" field to be an array of strings', done => {
      createSchema
        .validate({ ...attrs, list_ids: ['foo', 'bar', null] })
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"2" must be a string');

          done();
        })
        .catch(done);
    });

    it('creates a promise with the default value for "list_ids"', async () => {
      const result: any = await createSchema.validate(attrs);

      expect(result).to.contain.keys('list_ids');
      expect(result.list_ids).to.deep.equal([]);
    });

    it('creates a promise with the "list_ids" field', async () => {
      const list_ids = ['a', 'b'];

      const result: any = await createSchema.validate({ ...attrs, list_ids });

      expect(result).to.contain.keys('list_ids');
      expect(result.list_ids).to.deep.equal(list_ids);
    });
  });

  describe('update', () => {
    const attrs = {
      contributor_id: '8354a',
      politician_id: '6j434',
      quote: 'Alea iacta est',
      source_date: new Date().toISOString(),
      source_name: 'Gallic Times',
      source_url: 'https://google.com',
      title: 'Lowering tax rate 5%'
    };

    it('expects the "list_ids" field to be an array', done => {
      updateSchema
        .validate({ ...attrs, list_ids: 1234 })
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"list_ids" must be an array');

          done();
        })
        .catch(done);
    });

    it('expects the "list_ids" field to be an array of strings', done => {
      updateSchema
        .validate({ ...attrs, list_ids: ['foo', 'bar', null] })
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"2" must be a string');

          done();
        })
        .catch(done);
    });

    it('does not overwrite the "list_ids" fields if not given', async () => {
      const result = await updateSchema.validate(attrs);

      expect(result).to.not.contain.keys('list_ids');
    });

    it('updates the promise with the given "list_ids" field', async () => {
      const list_ids = ['a', 'b', 'c', 'd'];

      const result = await updateSchema.validate({ ...attrs, list_ids });

      expect(result).to.contain.keys('list_ids');
      expect(result.list_ids).to.deep.equal(list_ids);
    });
  });
});
