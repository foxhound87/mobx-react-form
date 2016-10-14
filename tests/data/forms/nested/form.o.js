import MobxReactForm from '../../../../src';

const fields = [
  'club.name',
  'club.city',
  'members[].firstname',
  'members[].lastname',
  'members[].hobbies[]',
];

class Form extends MobxReactForm {

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
        firstname: 'Charlie',
        lastname: 'Chaplin',
        hobbies: ['Golf', 'Basket'],
      }],
    });
  }
}


export default new Form({ fields }, 'Nested-M');
