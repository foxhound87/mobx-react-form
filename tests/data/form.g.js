import Form from '../../src/index';

const fields = {
  username: {
    label: 'Username',
  },
  email: {
    label: 'Email',
  },
  password: {
    label: 'Password',
  },
};

export default new Form({ fields });
