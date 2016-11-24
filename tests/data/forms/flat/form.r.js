import { Form } from '../../../../src';
import { isEmail, shouldBeEqualTo } from '../../extension/vjf';

const fields = {
  email: {
    label: 'Username',
    value: 's.jobs@apple.com',
    validate: [isEmail],
    related: ['emailConfirm'],
  },
  emailConfirm: {
    label: 'Email',
    value: 's.jobs@apple.com',
    validate: [isEmail, shouldBeEqualTo('email')],
  },
};

class NewForm extends Form {

  onInit(form) {
    form.update({
      email: 'invalid',
    });
  }
}


export default new NewForm({ fields }, 'Flat-R');
