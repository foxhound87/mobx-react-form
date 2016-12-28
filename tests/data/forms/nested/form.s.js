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

class NewForm extends Form {

  onInit(form) {
    form.set('value', {
      club: {
        name: 'club-name-set-value',
        city: 'club-city-set-value',
      },
      members: [{
        firstname: 'members-0-firstname-set-value',
        lastname: 'members-0-lastname-set-value',
        hobbies: [
          'members-0-hobbies-0-set-value',
          'members-0-hobbies-1-set-value',
        ],
      }, {
        firstname: 'members-1-firstname-set-value',
        lastname: 'members-1-lastname-set-value',
        hobbies: [
          'members-1-hobbies-0-set-value',
          'members-1-hobbies-1-set-value',
        ],
      }],
    });
  }
}


export default new NewForm({ plugins, fields, rules, values }, 'Nested-S');
