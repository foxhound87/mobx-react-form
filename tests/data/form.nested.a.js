import Form from '../../src';

const fields = [{
  name: 'address',
  label: 'Address',
  fields: [{
    name: 'street',
    label: 'Street',
    value: 'Broadway',
  }, {
    name: 'city',
    label: 'City',
    value: 'New York',
  }],
}];

export default new Form({ fields }, 'Nested-A');
