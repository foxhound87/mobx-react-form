import { expect } from 'chai';

import $ from './data/_.flat'; // FORMS

describe('Form submit() decoupled callback', () => {
  // $I
  it('$I.submit() should call onSuccess callback on valid form', (done) => {
    $.$I.submit({
      onSuccess: (form) => {
        expect(form.isValid).to.be.true; // eslint-disable-line
        done();
      },
    });
  });

  // $I
  it('$I.submit() should return a promise rejected by the onSuccess callback', () => {
    const err = new Error('boom');
    return $.$I.submit({
      onSuccess: () => Promise.reject(err),
    })
      .catch((v) => {
        expect(v).to.equal(err);
      });
  });

  // $N
  it('$N.submit() should call onError callback on invalid form', (done) => {
    $.$N.submit({
      onError: (form) => {
        expect(form.isValid).to.be.false; // eslint-disable-line
        done();
      },
    });
  });
});
