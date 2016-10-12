import MobxReactForm from '../../../../src';

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

class Form extends MobxReactForm {

  onInit(form) {
    form.update({ address: { city: 'Los Angeles' } });
    form.set('label', { address: { city: 'Cool City' } });
  }
}

export default new Form({ fields }, 'Nested-A');
