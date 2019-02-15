import * as yup from 'yup';
import { Form } from '../../../../src';
import $yup from '../../../../src/validators/YUP';

const fields = {
  club: null,
  members: [{
    firstname: null,
    lastname: 'Eastwood',
    yearOfBirth: 1930,
    hobbies: ['Soccer', 'Baseball'],
  }, {
    firstname: 'Charlie',
    lastname: 'Chaplin',
    yearOfBirth: null,
    hobbies: ['Golf', null],
  }],
};

const labels = {
  'club': 'The Club',
  'members[]': 'The Members',
  'members[].firstname': 'The First Name',
  'members[].lastname': 'The Last Name',
  'members[].yearOfBirth': 'The Year of Birth',
  'members[].hobbies[]': 'The Hobbie',
};

const schema = (y) =>
  y.object().shape({
    club: y.string().required(),
    members: y.array().of(y.object().shape({
      firstname: y.string().required(),
      lastname: y.string().required(),
      yearOfBirth: y.number().required().positive().integer(),
      hobbies: y.array().of(y.string().required()),
    })),
  });

const plugins = {
  yup: $yup({
    package: yup,
    schema,
  })
};

const options = {
  showErrorsOnInit: true,
};

export default new Form({ fields, labels }, { plugins, options, name: 'Nested-M1' });
