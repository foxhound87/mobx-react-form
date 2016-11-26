import MobxReactForm, { Field } from '../../../../src';
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

class NewField extends Field {

  newFieldProp = false;

  constructor(data) {
    super(data);

    this.newFieldProp = true;
  }
}

class NewForm extends MobxReactForm {

  makeField(data) {
    return new NewField(data);
  }

  onInit(form) {
    form.update({
      email: 'invalid',
    });
  }
}


export default new NewForm({ fields }, 'Flat-R');
