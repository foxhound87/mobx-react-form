import Form from '../../src';
import { isEmail, shouldBeEqualTo } from './_.extend.vjf';

const fields = {
  email: {
    label: 'Username',
    value: 's.jobs@apple.com',
    validate: [isEmail],
    related: ['emailConfirm'],
  },
  emailConfirm: {
    label: 'Email',
    value: 's.jobs@apple.com',
    validate: [isEmail, shouldBeEqualTo('email')],
  },
};

export default new Form({ fields }, 'R');
