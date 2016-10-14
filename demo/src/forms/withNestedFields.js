// const fields = {};

const fields = [
  'club.name',
  'club.city',
  'members[].firstname',
  'members[].lastname',
  'members[].hobbies[]',
];

const values = {
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
};

const labels = {
  club: 'x',
};

export default { fields, values, labels };
