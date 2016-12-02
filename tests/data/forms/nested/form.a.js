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
  }],
}];

class NewForm extends Form {

  onInit(form) {
    form.update({ user: { email: 'notAnEmail' } });
    form.set('label', { user: { emailConfirm: 'User Email' } });
  }
}

export default new NewForm({ fields }, 'Nested-A');
