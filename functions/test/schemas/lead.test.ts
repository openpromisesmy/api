import 'mocha';
import { expect } from 'chai';
import {
  create as createSchema,
  update as updateSchema
} from '../../schemas/lead';

describe.only('lead schema', () => {
  describe('create', () => {
    const validAttrs: any = {
      // TODO: move me to a factory
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

    describe('"link" field', () => {
      it('expects the "link" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.link;

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"link" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "link" to be a string', async () => {
        const attrs: any = { ...validAttrs, link: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"link" must be a string');
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"type" field', () => {
      it('expects the "type" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.type;

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"type" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "type" to be a string', async () => {
        const attrs: any = { ...validAttrs, type: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"type" must be a string');
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"submitter" field', () => {
      it('expects the "submitter" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.submitter;

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"submitter" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "submitter" to be a string', async () => {
        const attrs: any = { ...validAttrs, submitter: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"submitter" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"review_status" field', () => {
      it('expects the "review_status" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.review_status;

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"review_status" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "review_status" to be a string', async () => {
        const attrs: any = { ...validAttrs, review_status: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"review_status" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"reviewed_by" field', () => {
      it('expects the "reviewed_by" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.reviewed_by;

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"reviewed_by" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "reviewed_by" to be a string', async () => {
        const attrs: any = { ...validAttrs, reviewed_by: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"reviewed_by" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"original_promise" field', () => {
      it('expects the "original_promise" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.original_promise;

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"original_promise" is required'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "original_promise" to be a string', async () => {
        const attrs: any = { ...validAttrs, original_promise: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"original_promise" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"notes" field', () => {
      it('expects the "notes" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.notes;

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"notes" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "notes" to be a string', async () => {
        const attrs: any = { ...validAttrs, notes: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"notes" must be a string');
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"assigned_tracker" field', () => {
      it('expects the "assigned_tracker" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.assigned_tracker;

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"assigned_tracker" is required'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "assigned_tracker" to be a string', async () => {
        const attrs: any = { ...validAttrs, assigned_tracker: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"assigned_tracker" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"created_at" field', () => {
      it('expects the "created_at" to be a string', async () => {
        const attrs: any = { ...validAttrs, created_at: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"created_at" must be a valid ISO 8601 date'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"updated_at" field', () => {
      it('expects the "updated_at" to be a string', async () => {
        const attrs: any = { ...validAttrs, updated_at: 52765 };

        try {
          await createSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"updated_at" must be a valid ISO 8601 date'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });
  });

  describe('update', () => {
    const validAttrs: any = {
      // TODO: move me to a factory
      assigned_tracker: 'b5hqf73',
      created_at: '2019-05-20T13:14:41.489Z',
      id: 'gam3s42f3f2',
      link: 'https://example.org/foo/bar/quix',
      notes: 'Lorem Ipsum Dignitatum.',
      original_promise: 'fg4867',
      reviewed_by: 'g4342f',
      review_status: 'pending',
      submitter: 'f43g423',
      type: 'promise',
      updated_at: '2019-05-20T13:14:41.489Z'
    };

    describe('"link" field', () => {
      it('expects the "link" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.link;

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"link" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "link" to be a string', async () => {
        const attrs: any = { ...validAttrs, link: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"link" must be a string');
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"id" field', () => {
      it('expects the "id" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.id;

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"id" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "id" to be a string', async () => {
        const attrs: any = { ...validAttrs, id: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"id" must be a string');
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"type" field', () => {
      it('expects the "type" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.type;

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"type" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "type" to be a string', async () => {
        const attrs: any = { ...validAttrs, type: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"type" must be a string');
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"submitter" field', () => {
      it('expects the "submitter" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.submitter;

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"submitter" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "submitter" to be a string', async () => {
        const attrs: any = { ...validAttrs, submitter: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"submitter" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"review_status" field', () => {
      it('expects the "review_status" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.review_status;

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"review_status" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "review_status" to be a string', async () => {
        const attrs: any = { ...validAttrs, review_status: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"review_status" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"reviewed_by" field', () => {
      it('expects the "reviewed_by" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.reviewed_by;

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"reviewed_by" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "reviewed_by" to be a string', async () => {
        const attrs: any = { ...validAttrs, reviewed_by: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"reviewed_by" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"original_promise" field', () => {
      it('expects the "original_promise" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.original_promise;

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"original_promise" is required'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "original_promise" to be a string', async () => {
        const attrs: any = { ...validAttrs, original_promise: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"original_promise" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"notes" field', () => {
      it('expects the "notes" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.notes;

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"notes" is required');
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "notes" to be a string', async () => {
        const attrs: any = { ...validAttrs, notes: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage('"notes" must be a string');
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"assigned_tracker" field', () => {
      it('expects the "assigned_tracker" to be present', async () => {
        const attrs: any = { ...validAttrs };

        delete attrs.assigned_tracker;

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"assigned_tracker" is required'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });

      it('expects the "assigned_tracker" to be a string', async () => {
        const attrs: any = { ...validAttrs, assigned_tracker: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"assigned_tracker" must be a string'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"created_at" field', () => {
      it('expects the "created_at" to be a string', async () => {
        const attrs: any = { ...validAttrs, created_at: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"created_at" must be a valid ISO 8601 date'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });

    describe('"updated_at" field', () => {
      it('expects the "updated_at" to be a string', async () => {
        const attrs: any = { ...validAttrs, updated_at: 52765 };

        try {
          await updateSchema.validate(attrs);
        } catch (err) {
          expectValidationError(err).withMessage(
            '"updated_at" must be a valid ISO 8601 date'
          );
          return;
        }

        throw new Error('Expected validation to fail.');
      });
    });
  });

  function expectValidationError(actual: any) {
    expect(actual).to.be.an.instanceOf(Error);
    expect(actual.name).to.equal('ValidationError');

    return {
      withMessage(expectedMsg: string) {
        const [{ message }] = actual.details;
        expect(message).to.equal(expectedMsg);
      }
    };
  }
});
