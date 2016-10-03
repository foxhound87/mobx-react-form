// some custom validation functions
import {
  // checkUser,
  isEmail,
  shouldBeEqualTo,
} from './extension/vjf';

// define a json schema
const schema = {
  // $async: true,
  type: 'object',
  properties: {
    // username: { checkUser: 'user', type: 'string', minLength: 6, maxLength: 20 },
    // username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    devSkills: { type: 'number', range: [5, 10] },
    // terms: { enum: [true] }, // should be true to pass validation
  },
  required: ['username'],
};

// define fields
const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    rules: 'checkUser|required|string|between:5,15',
    // default: 'Claudio',
    // validate: [checkUser],
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
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
  },
  devSkills: {
    label: 'Dev Skills (5-10)',
    value: 5,
    default: 5,
  },
  terms: {
    label: 'Accept Terms',
    value: true,
    rules: 'boolean|accepted',
  },
};

export default { fields, schema };
