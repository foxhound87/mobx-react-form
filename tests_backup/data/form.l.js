import ajv from 'ajv';
import Form from '../../src';
import svkExtend from './_.extend.svk';

const plugins = {
  svk: {
    package: ajv,
    extend: svkExtend,
  },
};

const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
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
  $async: true,
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20, checkUser: 'user' },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
  },
};

export default new Form({ fields, schema, plugins }, 'L');
