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
        this.$('array').add(); // 0
        this.$('array').add(); // 1
        this.$('array').add(); // 2

        this.$('array').del(0);

        const proxy = new Proxy({
          preventDefault: () => {},
        }, {});

        this.$('array').onDel(proxy, 1);
        this.$('array[2]').onDel(proxy);
      },
    };
  }
}

export default new NewForm({ struct }, { name: 'Fixes-O' });
