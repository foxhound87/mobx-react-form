import ajv from 'ajv';
import { Form } from '../../../../src';
import { isEmail, shouldBeEqualTo } from '../../extension/vjf';
import svkExtend from '../../extension/svk';

const plugins = {
  svk: {
    package: ajv,
    extend: svkExtend,
  },
};

const fields = {
  username: {
    label: 'Username',
    value: 's.jobs@apple.com',
    validate: [isEmail, shouldBeEqualTo('email')],
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
    validate: isEmail,
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
  },
  devSkills: {
    label: 'Dev Skills',
    value: 5,
  },
};

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    // email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    devSkills: { range: [5, 10] },
  },
};

export default new Form({ fields, schema, plugins }, 'Flat-E');
