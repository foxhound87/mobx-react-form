import validatorjs from 'validatorjs';
import { Form } from '../../../../src';

const fields = [
  'deep',
  'deep.nested',
  'deep.nested.column2',
  'deep.nested.column3',
  'deep.nested.column2[].title',
  'deep.nested.column3[].title',
  'layout.column1',
  'layout.column1[].title',
  'users[].settings[].name',
  'users[].settings[].active',
];

const rules = {
  'layout.column1[].title': 'string|required',
  'layout.column2[].title': 'string|required',
  'deep.nested.column2[].title': 'string|required',
  'deep.nested.column3[].title': 'string|required',
};

const defaults = {
  'users[].settings[].name': 'Default Name',
  'users[].settings[].active': true,
};

const initials = {
  'users[].settings[].name': 'Initial Name',
  'users[].settings[].active': true,
};

class NewForm extends Form {

  plugins() {
    return {
      dvr: validatorjs,
    };
  }

  onInit(form) {
    form.$('layout').update({
      column1: [{
        title: 'THE NEW TITLE',
      }],
    });

    form.$('deep.nested').update({
      column2: [{
        title: 'THE NEW TITLE',
      }],
      column3: [{
        title: 'THE NEW TITLE',
      }],
    });
  }
}

export default new NewForm({ fields, rules, defaults, initials }, { name: 'Fixes-I' });
