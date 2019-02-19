import ajv from 'ajv';
import validatorjs from 'validatorjs';

import { Form } from '../../../../src';
import svkExtend from '../../extension/svk';

import dvr from '../../../../src/validators/DVR';
import svk from '../../../../src/validators/SVK';

const fields = {
  username: {
    label: 'Username',
  },
  email: {
    label: 'Email',
    rules: 'required|email|between:5,20',
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
    // email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    devSkills: { range: [1, 10] },
  },
};

const plugins = {
  dvr: dvr(validatorjs),
  svk: svk({
    schema,
    package: ajv,
    extend: svkExtend,
  }),
};

const options = {
  alwaysShowDefaultError: true,
  defaultGenericError: 'Custom Generic Error',
};

export default new Form({ fields }, { options, plugins, name: 'Flat-B' });
