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

    // form.add('member.hobbies'); // OLD
    form.$('member.hobbies').$(0).set('value', '000');  // 0
    form.$('member.hobbies').add('AAA');  // 1
    form.$('member.hobbies').add('BBB');  // 2
    form.$('member.hobbies').add('CCC');  // 3
    form.$('member.hobbies').add('DDD');  // 4
    form.$('member.hobbies').add('EEE');  // 5
    form.$('member.hobbies').add('FFF');  // 6
    // member.hobbies[] length: 6

    form.del('member.hobbies[0]');
    form.del('member.hobbies[2]');
    form.$('member.hobbies').del(3);
    form.$('member').del('hobbies[4]');
    // hobbies[] length should be 2

    form.$('member.info').add({
      firstname: 'AAA',
      lastname: 'BBB',
    });

    form.$('notIncrementalFields').add('XXX', {
      key: 'notIncrementalKey',
    });

    form.$('notIncrementalFields').add('XXX', {
      key: 'anotherNotIncrementalKey',
    });

    form.$('notIncrementalFields').add('XXX', {
      key: 'anotherOneNotIncrementalKey',
    });

    form.del('notIncrementalFields[anotherOneNotIncrementalKey]');
    form.$('notIncrementalFields').del('anotherNotIncrementalKey');
  }
}

export default new NewForm({ fields }, { name: 'Nested-T' });
