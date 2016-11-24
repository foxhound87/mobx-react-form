import { Form } from '../../../../src';

const fields = [
  'club.name',
  'club.city',
  'members',
  'members[].firstname',
  'members[].lastname',
  'members[].hobbies',
  'members[].hobbies[]',
];

class NewForm extends Form {

  onInit(form) {
    form.update({
      club: {
        name: 'HELLO',
        city: 'NY',
      },
      members: [{
        firstname: 'Clint',
        lastname: 'Eastwood',
        hobbies: ['Soccer', 'Baseball'],
      }, {
        firstname: null,
        lastname: 'Chaplin',
        hobbies: ['Golf', 'Basket'],
      }],
    });

    form.reset();
  }
}


export default new NewForm({ fields }, 'Nested-P');
