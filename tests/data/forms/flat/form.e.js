import ajv from 'ajv';
import validatorjs from 'validatorjs';
import { Form } from '../../../../src';
import { isEmail, shouldBeEqualTo } from '../../extension/vjf';
import svkExtend from '../../extension/svk';

import vjf from '../../../../src/validators/VJF';
import dvr from '../../../../src/validators/DVR';
import svk from '../../../../src/validators/SVK';

const fields = {
  username: {
    label: 'Username',
    value: 's.jobs@apple.com',
    validators: [isEmail, shouldBeEqualTo('email')],
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
    validators: isEmail,
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
  },
  devSkills: {
    label: 'Dev Skills',
    value: 5,
  },
  validatedDifferently: {
    value: 'x',
    label: 1,
    rules: 'integer',
    validatedWith: 'label',
  },
};

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 6, maxLength: 20 },
    // email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    devSkills: { range: [5, 10] },
  },
};

const plugins = {
  vjf: vjf(),
  dvr: dvr(validatorjs),
  svk: svk({
    package: ajv,
    extend: svkExtend,
    schema,
  }),
};

export default new Form({ fields }, { plugins, name: 'Flat-E' });
