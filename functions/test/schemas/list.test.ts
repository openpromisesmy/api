import 'mocha';
import { expect } from 'chai';

import {
  create as createSchema,
  update as updateSchema
} from '../../schemas/list';

describe('list schema', () => {
  describe('create', () => {
    it('expects the "title" field to be a string', done => {
      const attrs = { title: 123 };

      createSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"title" must be a string');

          done();
        })
        .catch(done);
    });

    it('expects the "created_at" field to be in the ISO format', done => {
      const attrs = { title: 'media', created_at: new Date().toUTCString() };

      createSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal(
            '"created_at" must be a valid ISO 8601 date'
          );

          done();
        })
        .catch(done);
    });

    it('expects the "updated_at" field to be in the ISO format', done => {
      const attrs = { title: 'media', updated_at: new Date().toUTCString() };

      createSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal(
            '"updated_at" must be a valid ISO 8601 date'
          );

          done();
        })
        .catch(done);
    });

    it('expects the "promise_ids" field to be an array', done => {
      const attrs = {
        title: 'weather',
        promise_ids: 1234,
        created_at: newYearsEve,
        updated_at: malaysiaDay
      };

      createSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"promise_ids" must be an array');

          done();
        })
        .catch(done);
    });

    it('expects the "promise_ids" field to be an array of strings', done => {
      const attrs = {
        title: 'weather',
        promise_ids: ['a1', 2, 3, 4],
        created_at: newYearsEve,
        updated_at: malaysiaDay
      };

      createSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"1" must be a string');

          done();
        })
        .catch(done);
    });

    it('does not require the "promise_ids" field', async () => {
      const attrs = {
        title: 'public safety',
        created_at: newYearsEve.toISOString(),
        updated_at: malaysiaDay.toISOString()
      };

      const result: any = await createSchema.validate(attrs);

      expect(result).to.have.all.keys(
        'title',
        'promise_ids',
        'created_at',
        'updated_at'
      );

      expect(result.promise_ids).to.deep.equal([]);
    });

    it('creates a list with a default value for the "promise_ids" field', async () => {
      const attrs = {
        title: 'public safety',
        promise_ids: ['abc1', 'abc2', 'abc3'],
        created_at: newYearsEve.toISOString(),
        updated_at: malaysiaDay.toISOString()
      };

      const result: any = await createSchema.validate(attrs);

      expect(result).to.have.all.keys(
        'title',
        'promise_ids',
        'created_at',
        'updated_at'
      );

      expect(result.title).to.be.a('string');
      expect(result.promise_ids).to.be.an('array');
      expect(result.created_at).to.be.an.instanceOf(Date);
      expect(result.updated_at).to.be.an.instanceOf(Date);
    });

    it('creates a list with fields of valid type', async () => {
      const attrs = {
        title: 'public safety',
        promise_ids: ['abc1', 'abc2', 'abc3'],
        created_at: newYearsEve.toISOString(),
        updated_at: malaysiaDay.toISOString()
      };

      const result: any = await createSchema.validate(attrs);

      expect(result).to.have.all.keys(
        'title',
        'promise_ids',
        'created_at',
        'updated_at'
      );

      expect(result.title).to.be.a('string');
      expect(result.promise_ids).to.be.an('array');
      expect(result.created_at).to.be.an.instanceOf(Date);
      expect(result.updated_at).to.be.an.instanceOf(Date);
    });

    it('creates a list', async () => {
      const attrs = {
        title: 'public safety',
        promise_ids: ['abc1', 'abc2', 'abc3'],
        created_at: newYearsEve.toISOString(),
        updated_at: malaysiaDay.toISOString()
      };

      const result: any = await createSchema.validate(attrs);

      expect(result).to.deep.equal({
        title: attrs.title,
        promise_ids: attrs.promise_ids,
        created_at: newYearsEve,
        updated_at: malaysiaDay
      });
    });

    it('creates a list with the default value for created_at', async () => {
      const attrs = {
        title: 'nature',
        updated_at: newYearsEve.toISOString()
      };

      const result: any = await createSchema.validate(attrs);

      expect(result).to.have.all.keys(
        'title',
        'promise_ids',
        'created_at',
        'updated_at'
      );

      expect(result.title).to.equal(attrs.title);

      const createdAtDiff = new Date().getTime() - result.created_at.getTime();
      const updatedAtDiff = newYearsEve.getTime() - result.updated_at.getTime();

      expect(Math.abs(createdAtDiff)).to.be.below(100);
      expect(Math.abs(updatedAtDiff)).to.be.below(100);
    });

    it('creates a list with the default value for updated_at', async () => {
      const attrs = {
        title: 'financial',
        created_at: newYearsEve.toISOString()
      };

      const result: any = await createSchema.validate(attrs);

      expect(result).to.have.all.keys(
        'title',
        'promise_ids',
        'created_at',
        'updated_at'
      );

      expect(result.title).to.equal(attrs.title);

      const createdAtDiff = newYearsEve.getTime() - result.created_at.getTime();
      const updatedAtDiff = new Date().getTime() - result.updated_at.getTime();

      expect(Math.abs(createdAtDiff)).to.be.below(100);
      expect(Math.abs(updatedAtDiff)).to.be.below(100);
    });

    it('requires the "title" field', done => {
      const attrs = {
        created_at: newYearsEve,
        updated_at: malaysiaDay
      };

      createSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"title" is required');

          done();
        })
        .catch(done);
    });

    it('accepts the "description" field', async () => {
      const attrs = { title: 'public safety', description: 'description' };
      const result: any = await createSchema.validate(attrs);

      expect(result.description).to.be.a('string');
      expect(result.description).to.equal(attrs.description);
    });
  });

  describe('update', () => {
    it('expects the "title" field to be a string', done => {
      const attrs = {
        title: 456,
        updated_at: malaysiaDay.toISOString()
      };

      updateSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"title" must be a string');

          done();
        })
        .catch(done);
    });

    it('expects the "updated_at" field to be in the ISO format', done => {
      const attrs = {
        title: 'public safety',
        updated_at: malaysiaDay.toUTCString()
      };

      updateSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal(
            '"updated_at" must be a valid ISO 8601 date'
          );

          done();
        })
        .catch(done);
    });

    it('expects the "promise_ids" field to be an array', done => {
      const attrs = {
        title: 'weather',
        promise_ids: 1234,
        created_at: newYearsEve,
        updated_at: malaysiaDay
      };

      updateSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"promise_ids" must be an array');

          done();
        })
        .catch(done);
    });

    it('expects the "promise_ids" field to be an array of strings', done => {
      const attrs = {
        title: 'weather',
        promise_ids: ['a1', 2, 3, 4],
        updated_at: malaysiaDay
      };

      updateSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"1" must be a string');

          done();
        })
        .catch(done);
    });

    it('does not overwrite the "promise_ids" field if not given', async () => {
      const attrs = {
        title: 'public safety',
        updated_at: malaysiaDay.toISOString()
      };

      const result: any = await updateSchema.validate(attrs);

      expect(result).to.have.all.keys('title', 'updated_at');
    });

    it('returns list fields of valid type', async () => {
      const attrs = {
        title: 'public safety',
        promise_ids: ['2a', '5a'],
        updated_at: malaysiaDay.toISOString()
      };

      const result: any = await updateSchema.validate(attrs);

      expect(result).to.have.all.keys('title', 'promise_ids', 'updated_at');
      expect(result.title).to.be.a('string');
      expect(result.promise_ids).to.be.an('array');
      expect(result.updated_at).to.be.instanceOf(Date);
    });

    it('updates a list given attributes', async () => {
      const attrs = {
        title: 'ecology',
        promise_ids: ['2a', '5a'],
        updated_at: newYearsEve.toISOString()
      };

      const result: any = await updateSchema.validate(attrs);

      expect(result).to.have.all.keys('title', 'promise_ids', 'updated_at');
      expect(result.title).to.equal(attrs.title);
      expect(result.promise_ids).to.deep.equal(attrs.promise_ids);

      const updatedAtDiff = newYearsEve.getTime() - result.updated_at.getTime();

      expect(Math.abs(updatedAtDiff)).to.be.below(100);
    });

    it('updates a list with the default value for updated_at', async () => {
      const attrs = { title: 'ecology' };

      const result: any = await updateSchema.validate(attrs);

      expect(result).to.have.all.keys('title', 'updated_at');
      expect(result.title).to.equal(attrs.title);

      const updatedAtDiff = new Date().getTime() - result.updated_at.getTime();

      expect(Math.abs(updatedAtDiff)).to.be.below(100);
    });

    it('does not allow to update the "created_at" field', done => {
      const attrs = {
        title: 'public safety',
        created_at: newYearsEve.toISOString(),
        updated_at: malaysiaDay.toISOString()
      };

      updateSchema
        .validate(attrs)
        .then(() => {
          done(new Error('Expected a failing path to execute'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.name).to.equal('ValidationError');

          const [{ message }] = err.details;
          expect(message).to.equal('"created_at" is not allowed');

          done();
        })
        .catch(done);
    });

    it('accepts the "description" field', async () => {
      const attrs = { title: 'public safety', description: 'description' };
      const result: any = await updateSchema.validate(attrs);

      expect(result.description).to.be.a('string');
      expect(result.description).to.equal(attrs.description);
    });
  });

  const malaysiaDay = (() => {
    const day = new Date();

    day.setDate(16);
    day.setMonth(8);

    return day;
  })();

  const newYearsEve = (() => {
    const day = new Date();

    day.setDate(1);
    day.setMonth(0);

    return day;
  })();
});
