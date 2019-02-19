import ajv from 'ajv';
import { Form } from '../../../../src';
import svkExtend from '../../extension/svk';
import svk from '../../../../src/validators/SVK';

const fields = {
  username: {
    label: 'Username',
    value: '',
  },
  email: {
    label: 'Email',
    value: '',
  },
  password: {
    label: 'Password',
    value: '',
  },
  devSkills: {
    label: 'Dev Skills',
    value: 1,
  },
};

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    devSkills: { range: [1, 10] },
  },
};

const plugins = {
  svk: svk({
    package: ajv,
    extend: svkExtend,
    schema,
  }),
};

class NewForm extends Form {

  hooks() {
    return {
      onInit(form) {
        this.invalidate('The user already exist');
      },
    };
  }
}

export default new NewForm({ fields }, { plugins, name: 'Flat-C' });
