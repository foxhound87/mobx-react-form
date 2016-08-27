import Form from '../../src';
import extend from './_.extend';

const fields = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
  password: 'thinkdifferent',
  terms: true,
  devSkills: 10, // 10 should fail with exclusiveRange on
  revenue: '233.715',
  assets: 305.277,
};

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    terms: { enum: [true, false] },
    devSkills: { range: [1, 10], exclusiveRange: true },
    revenue: { type: 'number' },
    assets: { type: 'number' },
  },
};

export default new Form({ fields, schema, extend });
