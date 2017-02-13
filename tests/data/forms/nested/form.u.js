import { expect } from 'chai';
import { Form } from '../../../../src';
import { isEmail, shouldBeEqualTo } from '../../extension/vjf';

const fields = [
  'user',
  // TO FIX
  // 'user.email',
  // 'user.emailConfirm',
];

const labels = {
  user: {
    email: 'Email',
    emailConfirm: 'Confirm Email',
  },
};

const values = {
  user: {
    email: 's.jobs@apple.com',
    emailConfirm: 's.jobs@apple.com',
  },
};

const validate = {
  'user.email': isEmail,
  'user.emailConfirm': [isEmail, shouldBeEqualTo('user.email')],
};

const related = {
  'user.email': ['user.emailConfirm'],
};

class NewForm extends Form {

  onInit() {
    this.on('update', ({ event, change }) =>
      it('Nested-U on("update") check event', () =>
          expect(event).to.be.equal(change.name)));

    this.observe({
      path: 'user.email',
      key: 'value',
      call: ({ change }) =>
        it('Nested-U user.email value should change to "notAnEmail"', () =>
          expect(change.newValue).to.be.equal('notAnEmail')),
    });

    this.update({ user: { email: 'notAnEmail' } });
  }
}

export default new NewForm({ fields, values, labels, validate, related }, { name: 'Nested-U' });

