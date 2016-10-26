import MobxReactForm from '../../../../src';

const fields = [
  'places[]',
];

const values = {
  places: [
    'NY',
    'NJ',
  ],
};

class Form extends MobxReactForm {

  onInit(form) {
    form.$('places').clear();
  }
}

export default new Form({ fields, values }, 'Fixes-E');
