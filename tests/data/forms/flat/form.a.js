import ajv from 'ajv';
import validatorjs from 'validatorjs';

import { Form } from '../../../../src';
import svkExtend from '../../extension/svk';

const plugins = {
  dvr: validatorjs,
  svk: {
    package: ajv,
    extend: svkExtend,
  },
};

const fields = {
  username: {
    label: 'Username',
    value: 'SteveJobs',
    rules: 'alpha|between:6,20',
    placeholder: 'Username Placeholder',
  },
  email: {
    label: 'Email',
    value: 's.jobs@apple.com',
  },
  password: {
    label: 'Password',
    value: 'thinkdifferent',
    rules: 'confirmed',
  },
  passwordConfirmation1: {
    label: 'Password Confirmation 1',
    value: 'thinkdifferent',
    rules: 'required|same:password',
  },
  password_confirmation: {
    label: 'Password Confirmation 2',
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
    // username: { type: 'string', minLength: 6, maxLength: 20 },
    email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    terms: { enum: [true, false] },
    devSkills: { range: [5, 10] },
    revenue: { type: 'number' },
    assets: { type: 'number' },
  },
};

export default new Form({ fields, schema, plugins }, 'Flat-A');
