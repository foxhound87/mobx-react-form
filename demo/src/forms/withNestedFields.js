const fields = [{
  name: 'address',
  label: 'Address',
  fields: [{
    name: 'street',
    label: 'Street',
    value: 'Broadway',
    rules: 'required',
  }, {
    name: 'city',
    label: 'City',
    value: 'New York',
  }],
}, {
  name: 'club',
  label: 'Club',
  value: 'Club Name',
  fields: [{
    name: 'xxx',
    label: 'XXX',
    value: 'CIAO',
  }],
}];

export default { fields };
