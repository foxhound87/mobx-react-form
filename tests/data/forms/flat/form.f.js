import ajv from 'ajv';
import { Form } from '../../../../src';
import { shouldBeEqualTo } from '../../extension/vjf';
import svkExtend from '../../extension/svk';

import vjf from '../../../../src/validators/VJF';
import svk from '../../../../src/validators/SVK';

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    devSkills: { range: [5, 10] },
  },
};

const plugins = {
  vjf: vjf(),
  svk: svk({
    package: ajv,
    extend: svkExtend,
    schema,
  }),
};

const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    validators: shouldBeEqualTo('email'),
    related: ['email'],
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
  },
  devSkills: {
    label: 'Dev Skills',
    value: 5,
  },
};

export default new Form({ fields }, { plugins, name: 'Flat-F' });
