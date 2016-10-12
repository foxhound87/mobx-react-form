import MobxReactForm from '../../../../src';

const fields = {
  state: {
    label: 'State',
    value: 'USA',
    fields: {
      city: {
        label: 'City',
        value: 'New York',
        fields: {
          places: {
            label: 'NY Places',
            fields: {
              centralPark: {
                label: 'Central Park',
                value: true,
              },
              statueOfLiberty: {
                label: 'Statue of Liberty',
                value: false,
              },
              empireStateBuilding: {
                label: 'Empire State Building',
                value: true,
              },
              brooklynBridge: {
                label: 'Brooklyn Bridge',
                value: true,
              },
            },
          },
        },
      },
    },
  },
};

class Form extends MobxReactForm {

  onInit(form) {
    form.$('state.city.places').set('label', 'NY Cool Places');
    form.$('state.city.places').$('empireStateBuilding').update(false);
    form.$('state.city.places.centralPark').update(false);
  }
}

export default new Form({ fields }, 'Nested-C');
