import { Form } from '../../../../src';

const fields = [{
  name: 'username',
  label: 'Username',
  computed: () => 'SteveJobs', // test computed value
}, {
  name: 'email',
  label: 'Email',
  value: ' s.jobs@apple.com ', // should be trimmed on initial validation and pass validation
  options: {
    validateTrimmedValue: true // <---
  }
}];

export default new Form({ fields }, { name: 'Flat-Q' });
