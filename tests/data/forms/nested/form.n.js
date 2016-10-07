import Form from '../../../../src';

const values = {
  clubname: 'HELLO',
  members: [{
    firstname: 'Clint',
    lastname: 'Eastwood',
    hobbies: ['Soccer', 'Baseball'],
  }, {
    firstname: 'Charlie',
    lastname: 'Chaplin',
    hobbies: ['Golf', 'Basket'],
  }],
};

export default new Form({ values }, 'Nested-M');
