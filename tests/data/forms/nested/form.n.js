import { Form } from '../../../../src';

const fields = [
  'club.name',
  'club.city',
  'members',
  'members[].firstname',
  'members[].lastname',
  'members[].hobbies',
  'members[].hobbies[]',
];

const values = {
  club: 'HELLO',
  members: [{
    firstname: 'Clint',
    lastname: 'Eastwood',
    hobbies: ['Soccer', 'Baseball'],
  }, {
    firstname: null,
    lastname: 'Chaplin',
    hobbies: ['Golf', 'Basket'],
  }],
};

export default new Form({ fields, values }, 'Nested-N');
