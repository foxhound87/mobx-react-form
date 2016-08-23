import Form from '../../src/index';
import extend from './_.extend';

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
  terms: {
    label: 'Accept Terms',
    value: true,
  },
  devSkills: {
    label: 'Dev Skills',
    value: 5,
  },
  revenue: {
    label: 'Revenue (Billion $)',
    value: '233.715',
  },
  assets: {
    label: 'Assets (Billion $)',
    value: 305.277,
  },
};

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    terms: { enum: [true, false] },
    devSkills: { range: [5, 10] },
    revenue: { type: 'number' },
    assets: { type: 'number' },
  },
};

export default new Form({ fields, schema, extend });
