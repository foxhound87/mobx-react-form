import { Form } from '../../../../src';

const fields = [
  // FIX: #282 (reserved keywords)
  'incident',
  'incident[].type',
  'incident[].value',
  'incident[].options',
];

class NewForm extends Form {
  onInit() {
    // FIX: #282 (reserved keywords)
    this.$('incident').add();
  }
}

export default new NewForm({ fields });
