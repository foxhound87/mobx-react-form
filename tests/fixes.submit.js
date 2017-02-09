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
          it('$L state.option "validateOnChange" should be true', () =>
            expect(form.state.options.get('validateOnChange')).to.be.true);

          it('$L email value should be equal to "notAnEmailYet"', () =>
            expect(form.$('email').value).to.be.equal('notAnEmailYet'));

          it('$L email hasError should be true', () =>
            expect(form.$('email').hasError).to.be.true);
        });

        expect(form.isValid).to.be.false; // eslint-disable-line
        done();
      },
    });
  });
});
