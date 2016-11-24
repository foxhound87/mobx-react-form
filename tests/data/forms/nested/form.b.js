import { Form } from '../../../../src';

const fields = [{
  name: 'state',
  label: 'State',
  value: 'USA',
  fields: [{
    name: 'city',
    label: 'City',
    value: 'New York',
    fields: [{
      name: 'places',
      label: 'NY Places',
      fields: [{
        name: 'centralPark',
        label: 'Central Park',
        value: true,
      }, {
        name: 'statueOfLiberty',
        label: 'Statue of Liberty',
        value: false,
      }, {
        name: 'empireStateBuilding',
        label: 'Empire State Building',
        value: true,
      }],
    }],
  }],
}];

class NewForm extends Form {

  onInit(form) {
    form.$('state.city.places').set('label', 'NY Cool Places');

    form.$('state.city.places').update({
      empireStateBuilding: false,
      centralPark: false,
    });
  }
}

export default new NewForm({ fields }, 'Nested-B');
