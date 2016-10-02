import MobxReactForm from '../../src';

const values = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
  terms: true,
};

const labels = {
  username: 'Username',
  email: 'Email',
  password: 'Password',
  passwordConfirm: 'Confirm Password',
  terms: 'Accept Terms of Service',
};

class Form extends MobxReactForm {

  onInit(form) {
    form.invalidate();
  }
}

export default new Form({ values, labels }, 'O');
