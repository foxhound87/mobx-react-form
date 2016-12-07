import { Form } from '../../../../src';
import { isEmail, shouldBeEqualTo } from '../../extension/vjf';

const fields = [{
  name: 'user',
  label: 'User',
  fields: [{
    name: 'email',
    label: 'Email',
    validate: isEmail,
    related: ['user.emailConfirm'],
  }, {
    name: 'emailConfirm',
    label: 'Confirm Email',
    value: 's.jobs@apple.com',
    validate: [isEmail, shouldBeEqualTo('user.email')],
  }, {
    name: 'password',
    label: 'Password',
    value: 'thinkdifferent',
  }],
}];

class NewForm extends Form {

  onInit(form) {
    form.update({ user: { email: 'notAnEmail' } });
    form.set('label', { user: { emailConfirm: 'Confirm User Email' } });
    form.$('user.password').invalidate('Password Invalid');
  }
}

export default new NewForm({ fields }, 'Nested-A');
