import { Form } from '../../../../src';

const fields = [
  'places[]',
];

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

export default new NewForm({ fields, values }, 'Fixes-E');
