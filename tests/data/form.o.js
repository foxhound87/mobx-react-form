import MobxReactForm from '../../src';

const fields = ['username', 'email', 'password', 'passwordConfirm', 'terms'];

const values = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
  terms: true,
};

const labels = {
  username: 'Username',
  email: 'E-mail',
  password: 'Password',
  passwordConfirm: 'Confirm Password',
  terms: 'Accept Terms of Service',
};

class Form extends MobxReactForm {

  onInit(form) {
    form.invalidate();
  }
}

export default new Form({ fields, values, labels });
