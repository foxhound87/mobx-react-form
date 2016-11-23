import MobxReactForm from '../../../../src';

const fields = [
  'items[].name',
];

const labels = {
  'items[]': 'ItemLabel',
  'items[].name': 'ItemsNameLabel',
};

class Form extends MobxReactForm {

  onInit(form) {
    const items = form.$('items');
    for (let i = 0; i <= 20; i++) items.add(); // eslint-disable-line
  }
}

export default new Form({ fields, labels }, 'Fixes-G');
