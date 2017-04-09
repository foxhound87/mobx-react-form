import { Form } from '../../../../src';

const fields = [
  'roles[]',
  'roles[].id',
  'array[]',
  'array[].id',
];

class NewForm extends Form {
  onInit() {
    this.$('array').add();
    this.$('array').del(0);
  }
}

export default new NewForm({ fields }, { name: 'Fixes-O' });
