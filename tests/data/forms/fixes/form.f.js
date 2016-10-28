import MobxReactForm from '../../../../src';

const fields = [
  'inventoryLevel',
  'inventoryLevel.value',
  'places[]',
];

const values = {
  inventoryLevel: {
    value: 2,
  },
  places: [
    'NY',
    'NJ',
  ],
};

class Form extends MobxReactForm {

  onInit(form) {
    form.update({ places: ['NY', 'NJ', 'AR'] });
    form.update({ places: ['NY', 'NJ'] });
  }
}

export default new Form({ fields, values }, 'Fixes-F');
