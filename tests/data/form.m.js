import ajv from 'ajv';
import validatorjs from 'validatorjs';

import Form from '../../src';
import dvrExtend from './_.extend.dvr';

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

export default new Form({ fields, schema, plugins }, 'M');
