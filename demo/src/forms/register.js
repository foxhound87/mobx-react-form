// some custom validation functions
import {
  isEmail,
  shouldBeEqualTo,
} from '../../../tests/data/_.validators';

// define a json schema
const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    devSkills: { type: 'number', range: [5, 10] },
    terms: { enum: [true] }, // should be true to pass validation
  },
  required: ['username'],
};

// define fields
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    default: 'Claudio',
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
    related: ['emailConfirm'],
  },
  emailConfirm: {
    label: 'Confirm Email',
    value: 's.jobs@apple.com',
    validate: [isEmail, shouldBeEqualTo('email')],
    related: ['email'],
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
  },
  devSkills: {
    label: 'Dev Skills (5-10)',
    value: 5,
    default: 0,
  },
  terms: {
    label: 'Accept Terms',
    value: true,
  },
};

export default { fields, schema };
