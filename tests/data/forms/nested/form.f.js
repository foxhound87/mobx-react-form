import validatorjs from 'validatorjs';
import { Form } from '../../../../src';

const plugins = {
  dvr: validatorjs,
};

const fields = {
  state: {
    label: 'State',
    value: 'USA',
    rules: 'integer',
    fields: {
      city: {
        label: 'City',
        value: 'New York',
        rules: 'integer',
        fields: {
          places: {
            label: 'NY Places',
            value: 'NY Places',
            rules: 'integer',
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

const rules = {
  'state': 'integer',
  'state.city': 'integer',
  'state.city.places': 'integer',
};

export default new Form({ fields, plugins, rules }, 'Nested-F');
