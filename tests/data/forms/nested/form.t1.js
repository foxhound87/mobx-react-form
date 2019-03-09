import { Form } from '../../../../src';

const fields = [
  'hobbies[]',
];

class NewForm extends Form {

  options() {
    return {
      softDelete: true,
    };
  }

  hooks() {
    return {
      onInit(form) {
        form.$('hobbies').add({ value: 'AAA' });
        form.$('hobbies').add({ value: 'BBB' });
        form.$('hobbies').add({ value: 'CCC' });

        form.del('hobbies[1]');
      },
    };
  }
}

export default new NewForm({ fields }, { name: 'Nested-T1' });
