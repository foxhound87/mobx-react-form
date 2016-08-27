import Form from '../../src';
import extend from './_.extend';

const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 6,
      maxLength: 20,
      title: 'Username',
      default: 'SteveJobs',
    },
    email: {
      type: 'string',
      format: 'email',
      minLength: 5,
      maxLength: 20,
      title: 'Email',
      default: 's.jobs@apple.com',
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 20,
      title: 'Password',
      default: 'thinkdifferent',
    },
    devSkills: {
      range: [5, 10],
      /* title: 'Dev Skills', default: 5 */
    },
  },
};

export default new Form({ schema, extend });
