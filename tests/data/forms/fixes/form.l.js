import validatorjs from 'validatorjs';
import { expect } from 'chai';
import { Form } from '../../../../src';

import dvr from '../../../../src/validators/DVR';

const fields = [
  'email',
];

const values = {
  email: 's.jobs@apple.com',
};

const rules = {
  email: 'required|email',
};

class NewForm extends Form {

  plugins() {
    return {
      dvr: dvr(validatorjs),
    };
  }

  options() {
    return {
      validateOnChange: false,
    };
  }

  hooks() {
    return {
      onInit() {
        this.$('email').set('type', 'email'); // #415
        this.$('email').set('value', 'notAnEmail');

        describe('Form $L onInit() checks', () => {
          it('$L state.options "validateOnChange" should be false', () =>
            expect(this.state.options.get('validateOnChange')).to.be.false);

          it('$L email value should be equal to "notAnEmail"', () =>
            expect(this.$('email').value).to.be.equal('notAnEmail'));

          it('$L email hasError should be false', () =>
            expect(this.$('email').hasError).to.be.false);

          it('$L form hasError should be false', () =>
            expect(this.hasError).to.be.false);

          it('$L form isValid should be true', () =>
            expect(this.isValid).to.be.true);
        });
      },
    };
  }
}

export default new NewForm({ fields, values, rules }, { name: 'Fixes-L' });
