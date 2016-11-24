import validatorjs from 'validatorjs';
import { Form } from '../../../../src';

const plugins = { dvr: validatorjs };

const fields = [
  'club.name',
  'club.city',
  'members',
  'members[].firstname',
  'members[].lastname',
  'members[].hobbies',
  'members[].hobbies[]',
];

const rules = {
  'club.name': 'required|integer',
  'club.city': 'required|integer',
  'members[].firstname': 'required|integer',
  'members[].lastname': 'required|integer',
  'members[].hobbies': 'required|integer',
  'members[].hobbies[]': 'required|integer',
};

const values = {
  club: {
    name: 'HELLO',
    city: 'NY',
  },
  members: [{
    firstname: 'Clint',
    lastname: 'Eastwood',
    hobbies: ['Soccer', 'Baseball'],
  }, {
    firstname: 'Charlie',
    lastname: 'Chaplin',
    hobbies: ['Golf', 'Basket'],
  }],
};

export default new Form({ plugins, fields, rules, values }, 'Nested-S');
