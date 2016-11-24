import { Form } from '../../../../src';

const fields = [
  'hobbies',
  'hobbies[]',
  'member',
  'member.hobbies',
  'member.hobbies[]',
];

class NewForm extends Form {

  onInit(form) {
    form.add('hobbies');
    form.add('hobbies');
    form.add('hobbies');
    form.$('hobbies').add();
    form.$('hobbies').add();
    // hobbies[] length: 6

    form.del('hobbies[0]');
    form.del('hobbies[2]');
    form.$('hobbies').del(3);
    // hobbies[] length should be 3

    form.$('member').add('hobbies');
    form.$('member').add('hobbies');
    form.$('member').add('hobbies');
    form.$('member.hobbies').add();
    form.add('member.hobbies');
    // member.hobbies[] length: 6

    form.del('member.hobbies[0]');
    form.del('member.hobbies[2]');
    form.$('member.hobbies').del(3);
    // hobbies[] length should be 3
  }
}

export default new NewForm({ fields }, 'Nested-T');
