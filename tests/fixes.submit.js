import { expect } from 'chai';

import $ from './data/_.fixes'; // FORMS

describe('Form submit() decoupled callback', () => {
  // $L
  it('$L.submit() should call onError callback on invalid form', (done) => {
    $.$L.submit({
      onError: (form) => {
        form.state.options.set({ validateOnChange: true });
        form.$('email').set('value', 'notAnEmailYet');

        describe('Form $L onError() checks', () => {
          it('$L state.options "validateOnChange" should be true', () =>
            expect(form.state.options.get('validateOnChange')).to.be.true);

          it('$L email value should be equal to "notAnEmailYet"', () =>
            expect(form.$('email').value).to.be.equal('notAnEmailYet'));

          it('$L email hasError should be true', () =>
            expect(form.$('email').hasError).to.be.true);

          it('$L form submitted should be 1', () =>
            expect(form.submitted).to.equal(1));
        });

        // eslint-disable-next-line
        expect(form.isValid).to.be.false;
        done();
      },
    });
  });

  // $472
  describe('$472 submit', () => {
    it('$472 submit', (done) => {
      $.$472.submit()
        .then(() => {
          done();
        });
    });
  });

  // $480
  describe('$480 submit', () => {
    it('$480 submit', (done) => {
      $.$480.submit()
        .then((instance) => {
          describe('Form $480 submit checks', () => {
            it('$480 .isValid should be false.', () =>
              expect($.$480.isValid).to.be.false);

            it('$480 $(passwordConfirm).isValid should be false.', () =>
              expect($.$480.$('passwordConfirm').isValid).to.be.false);

            const msg = 'The Password Confirmation field is required when Password Required is true.';

            it('$480 $(passwordConfirm).error should be equal ' + msg, () =>
              expect($.$480.$('passwordConfirm').error).to.be.equal(msg));
          });
          done();
        });
    });
  });
});
