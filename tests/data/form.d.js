import Form from '../../src/index';
import extend from './_.extend';

const fields = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
  password: 'thinkdifferent',
  devSkills: 11, // should fail
};

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    devSkills: { range: [1, 10], exclusiveRange: true },
  },
};

export default new Form({ fields, schema, extend });
