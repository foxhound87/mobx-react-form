import { Form } from '../../../../src';

const fields = [
  'hobbies[]',
  'member.hobbies[]',
  'member.info[]',
  'member.info[].firstname',
  'member.info[].lastname',
  'notIncrementalFields[]',
];

class NewForm extends Form {

  onInit(form) {
    form.$('hobbies').add('AAA');
    form.$('hobbies').add('BBB');
    form.$('hobbies').add('CCC');
    form.$('hobbies').add('DDD');
    form.$('hobbies').add('EEE');
    // hobbies[] length: 6

    form.del('hobbies[0]');
    form.del('hobbies[2]');
    form.$('hobbies').del(3);
    // hobbies[] length should be 3

    form.$('member.hobbies').add('AAA');
    form.$('member.hobbies').add('BBB');
    form.$('member.hobbies').add('CCC');
    form.$('member.hobbies').add('DDD');
    // form.add('member.hobbies'); // old
    form.$('member.hobbies').add('EEE');
    // member.hobbies[] length: 6

    form.del('member.hobbies[0]');
    form.del('member.hobbies[2]');
    form.$('member.hobbies').del(3);
    // hobbies[] length should be 3

    form.$('member.info').add({
      firstname: 'AAA',
      lastname: 'BBB',
    });

    form.$('notIncrementalFields').add('XXX', {
      key: 'notIncrementalKey',
    });
  }
}

export default new NewForm({ fields }, 'Nested-T');
