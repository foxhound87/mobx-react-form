import ajv from 'ajv';
import validatorjs from 'validatorjs';

import MobxReactForm from '../../../../src';
import dvrExtend from '../../extension/dvr';

const plugins = {
  svk: ajv,
  dvr: {
    package: validatorjs,
    extend: dvrExtend,
  },
};

const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    default: 'Claudio',
    rules: 'checkUser',
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
  },
};

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
  },
};

class Form extends MobxReactForm {

  onInit(form) {
    // subsequent clear and reset
    form.clear(); // to empty values
    form.reset(); // to default or initial values
  }
}

export default new Form({ fields, schema, plugins }, 'Flat-M');
