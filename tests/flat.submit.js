import { expect } from 'chai';

import $ from './data/_.flat'; // FORMS

describe('Form submit() decoupled callback', () => {
  // $A
  it('$A.submit() should call onSuccess callback on valid form', (done) => {
    $.$A.submit({
      onSuccess: (form) => {
        expect(form.submitted).to.equal(1);
        expect(form.isValid).to.be.true;
        done();
      },
    });
  });

  // $I
  it('$I.submit() should call onSuccess callback on valid form', (done) => {
    $.$I.submit({
      onSuccess: (form) => {
        expect(form.submitted).to.equal(1);
        expect(form.isValid).to.be.true;
        done();
      },
    });
  });

  // $N
  it('$N.submit() should call onError callback on invalid form', (done) => {
    $.$N.submit({
      onError: (form) => {
        expect(form.submitted).to.equal(1);
        expect(form.isValid).to.be.false;
        done();
      },
    });
  });
});
