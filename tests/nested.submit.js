import { expect } from 'chai';

import $ from './data/_.nested'; // FORMS

describe('Nested Form Manual submit()', () => {
  // $R
  it('$R.submit() should call onSuccess callback', (done) => {
    $.$R.$('members').submit().then((instance) => {
      expect(instance.$submitCount).to.equal(1);
      expect(instance.hasSubmitted).to.be.true; // eslint-disable-line
      expect(instance.isValid).to.be.true; // eslint-disable-line
      done();
    });
  });
});
