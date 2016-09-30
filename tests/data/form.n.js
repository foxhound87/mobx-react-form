import ajv from 'ajv';
import Form from '../../src';
import { checkUser } from './_.extend.vjf';

const plugins = { svk: ajv };

const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    validate: [checkUser], // (promise) should fail
  },
  email: {
    label: 'Email',
    value: '12345', // should fail
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

export default new Form({ fields, schema, plugins }, 'N');
