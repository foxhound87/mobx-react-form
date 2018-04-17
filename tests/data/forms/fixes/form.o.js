import { Form } from '../../../../src';

const struct = [
  'roles[]',
  'roles[].id',
  'array[]',
  'array[].id',
];

class NewForm extends Form {

  hooks() {
    return {
      onInit() {
        this.$('array').add();
        this.$('array').del(0);
      },
    };
  }
}

export default new NewForm({ struct }, { name: 'Fixes-O' });
