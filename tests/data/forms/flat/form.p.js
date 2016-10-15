import validatorjs from 'validatorjs';
import MobxReactForm from '../../../../src';
import dvrExtend from '../../extension/dvr';
import { shouldBeEqualTo } from '../../extension/vjf';

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

class Form extends MobxReactForm {

  onInit(form) {
    form.$('username').set('label', 'UserName');
    form.reset();
  }
}


export default new Form({

  fields, values, defaults, labels, disabled, validate, rules, plugins,

}, 'P');
