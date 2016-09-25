import validatorjs from 'validatorjs';
import Form from '../../src';
import dvrExtend from './_.extend.dvr';
import { shouldBeEqualTo } from './_.validators';

const plugins = {
  dvr: {
    package: validatorjs,
    extend: dvrExtend,
  },
};

const fields = ['username', 'email', 'password', 'passwordConfirm', 'terms'];

const values = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
  terms: true,
};

const defaults = {
  username: 'TestUser',
};

const labels = {
  passwordConfirm: 'Confirm Password',
};

const validate = {
  email: shouldBeEqualTo('username'), // should fail
};

const rules = {
  username: 'email', // should fail
};

const disabled = {
  terms: true,
};

export default new Form({

  fields, values, defaults, labels, disabled, validate, rules, plugins,

}, 'P');
