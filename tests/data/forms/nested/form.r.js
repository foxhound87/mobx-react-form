import { expect } from 'chai';
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
  'email': ['required', 'regex:^[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([.-]?[a-zA-Z0-9]+)*).([A-Za-z]{2,})$'],
  'club.name': 'required|string',
  'club.city': 'required|string',
  'members[].firstname': 'required|string',
  'members[].lastname': 'required|string',
  'members[].hobbies': 'required|string',
  'members[].hobbies[]': 'required|string',
};

const values = {
  email: 's.jobs@apple.com',
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

const checkFieldset = fieldset =>
  describe('Nested Form onSuccess()', () =>
    it('Fieldset should have "isField" prop', () =>
      expect(fieldset).to.have.property('isField')));

const submit = {
  onSuccess(fieldset) {
    checkFieldset(fieldset);
  },
  onError(fieldset) {
    checkFieldset(fieldset);
  },
};

const onSubmit = {
  'club': submit,
  'members': submit,
  'members[]': submit,
};

export default new Form({ fields, rules, values, onSubmit }, { plugins, name: 'Nested-R' });
