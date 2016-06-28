import Form from '../../src/index';
import extend from './extend';

const fields = {
  username: {
    label: 'Username',
  },
  email: {
    label: 'Email',
  },
  password: {
    label: 'Password',
  },
  devSkills: {
    label: 'Dev Skills',
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
