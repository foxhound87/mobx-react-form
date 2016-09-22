import MobxReactForm from '../../src';

const fields = {
  username: 'SteveJobs',
  email: 's.jobs@apple.com',
  password: 'thinkdifferent',
  terms: true,
};

const labels = {
  username: 'Username',
  email: 'E-mail',
  password: 'Password',
  terms: 'Accept Terms of Service',
};

class Form extends MobxReactForm {

  onInit(form) {
    form.invalidate();
  }
}

export default new Form({ fields, labels });
