import { Form } from '../../../../src';

const fields = [
  'inventoryLevel.value',
];

const values = {
  inventoryLevel: {
    value: 2,
  },
};

export default new Form({ fields, values }, 'Fixes-B');
