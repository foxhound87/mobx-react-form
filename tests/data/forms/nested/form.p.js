import MobxReactForm from '../../../../src';

const fields = [
  'club.name',
  'club.city',
  'members',
  'members[].firstname',
  'members[].lastname',
  'members[].hobbies',
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

    form.reset();
  }
}


export default new Form({ fields }, 'Nested-O');
