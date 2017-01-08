import { Form } from '../../../../src';

const fields = [
  'places[]',
];

const options = {
  places: ['a', 'b', 'c'],
};

const values = {
  places: [
    'NY',
    'NJ',
  ],
};

class NewForm extends Form {

  onInit(form) {
    form.$('places').clear();
  }
}

export default new NewForm({ fields, values, options }, { name: 'Fixes-E' });
