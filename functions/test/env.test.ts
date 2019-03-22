import { expect } from 'chai';
import 'mocha';

describe('test env variable', () => {
  it('is defined for the current environment', () => {
    /* tslint:disable-next-line */
    expect(process.env.NODE_ENV).to.not.be.undefined;
  });

  it('is set to "test"', () => {
    expect(process.env.NODE_ENV).to.equal('test');
  });
});
