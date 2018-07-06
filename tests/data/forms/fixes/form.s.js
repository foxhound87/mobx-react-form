import { Form } from '../../../../src';

const struct = [
  'array',
];

class NewForm extends Form {

  hooks() {
    return {
      onInit() {
        this.$('array').add({ name: 'item_to_delete' });
        this.del('array.item_to_delete');

        this.$('array').add({ name: 'item_to_delete2' });
        this.$('array').del('item_to_delete2');

        this.add({ name: 'item_to_delete_3' });
        this.del('item_to_delete_3');
      },
    };
  }
}

export default new NewForm({ struct }, { name: 'Fixes-S' });
