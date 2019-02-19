import ajv from 'ajv';
import validatorjs from 'validatorjs';

import { Form } from '../../../../src';
import dvrExtend from '../../extension/dvr';

import dvr from '../../../../src/validators/DVR';
import svk from '../../../../src/validators/SVK';

const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    default: 'Claudio',
    rules: 'checkUser:ignoreCase',
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

const plugins = {
  svk: svk({
    package: ajv,
    schema,
  }),
  dvr: dvr({
    package: validatorjs,
    extend: dvrExtend,
  }),
};


class NewForm extends Form {

  hooks() {
    return {
      onInit(form) {
        // subsequent clear and reset
        form.clear(); // to empty values
        form.reset(); // to default or initial values
      },
    };
  }
}

export default new NewForm({ fields }, { plugins, name: 'Flat-M' });
