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

  onInit(form) {
    form.update({ user: { email: 'notAnEmail' } });
  }
}

export default new NewForm({ fields, values, labels, validate, related }, 'Nested-U');

