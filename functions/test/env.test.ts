import 'mocha';
import { expect } from 'chai';

describe('test env variable', () => {
  it('is defined for the current environment', () => {
    expect(process.env.NODE_ENV).to.not.be.undefined;
  });

  it('is set to "test"', () => {
    expect(process.env.NODE_ENV).to.equal('test');
  });
});
