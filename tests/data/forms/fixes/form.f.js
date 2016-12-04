import { Form } from '../../../../src';

const fields = [
  'ids[]',
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

class NewForm extends Form {

  onInit(form) {
    form.update({ ids: [1, 2, 3] });
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

export default new NewForm({ fields, values }, 'Fixes-F');
