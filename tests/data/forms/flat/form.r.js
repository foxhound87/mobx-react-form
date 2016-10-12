import MobxReactForm from '../../../../src';
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

class Form extends MobxReactForm {

  onInit(form) {
    form.update({
      email: 'invalid',
    });
  }
}


export default new Form({ fields }, 'R');
