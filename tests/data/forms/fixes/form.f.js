import MobxReactForm from '../../../../src';

const fields = [
  'inventoryLevel',
  'inventoryLevel.value',
  'places[]',
  'skills[]',
  'members[].hobbies[]',
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
    form.update({ skills: [] });

    form.update({
      members: [{
        hobbies: ['Soccer', 'Baseball', 'Basket'],
      }, {
        hobbies: [],
      }],
    });
  }
}

export default new Form({ fields, values }, 'Fixes-F');
