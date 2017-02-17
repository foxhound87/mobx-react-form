import { expect } from 'chai';
import validatorjs from 'validatorjs';
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

const rules = {
  'club.name': 'required|integer',
  'club.city': 'required|integer',
  'members[].firstname': 'required|integer',
  'members[].lastname': 'required|integer',
  'members[].hobbies': 'required|integer',
  'members[].hobbies[]': 'required|integer',
};

const checkObserverNewValue = (path, $path, newValue, $value) => {
  if (path !== $path) return;
  it(`members.0.hobbies.0 change.newValue should be equal to "${$value}"`, () =>
    expect(newValue).to.be.equal($value));
};

const observers = {
  'club': [{
    key: 'value',
    call: ({ form }) => describe('Check Nested-S value@club Disposers', () =>
      it('Disposers should have value@club prop', () =>
        expect(form.state.disposers).to.have.property('value@club'))),
  }],
  'members': [{
    key: 'fields',
    call: ({ form }) => describe('Check Nested-S fields@members Disposers', () =>
      it('Disposers should have fields@members prop', () =>
        expect(form.state.disposers).to.have.property('fields@members'))),
  }],
  'members[].hobbies[]': [{
    key: 'value',
    call: ({ change, path }) =>
      describe('Check Nested-S value@members[].hobbies[] Disposers', () => {
        checkObserverNewValue(path, 'members.0.hobbies.0', change.newValue, 'members-0-hobbies-0-set-value');
        checkObserverNewValue(path, 'members.0.hobbies.1', change.newValue, 'members-0-hobbies-1-set-value');
        checkObserverNewValue(path, 'members.1.hobbies.0', change.newValue, 'members-1-hobbies-0-set-value');
        checkObserverNewValue(path, 'members.1.hobbies.1', change.newValue, 'members-1-hobbies-1-set-value');
      }),
  }],
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

  plugins() {
    return {
      dvr: validatorjs,
    };
  }

  setup() {
    // omit "rules" (use constructor)
    return { fields, values };
  }

  onInit(form) {
    // same as form.set('value', { ... });
    form.set({
      club: {
        name: 'club-name-set-value',
        city: 'club-city-set-value',
      },
    });

    form.set('value', {
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

    // dispose all hobbies 'value' observers recursively
    this.$('members')
      .map(members => members.$('hobbies')
        .map(hobbies => hobbies.dispose('value')));

    describe('Check Nested-S value@members[].hobbies[] Disposers', () =>
      it('Disposers should have value@members.0.hobbies.0 prop', () =>
        expect(form.state.disposers).not.to.have.property('value@members.0.hobbies.0')));
  }
}


export default new NewForm({ rules }, { name: 'Nested-S' });
