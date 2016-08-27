import Form from '../../src';
import extend from './_.extend';

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

export default new Form({ fields, schema, extend });
