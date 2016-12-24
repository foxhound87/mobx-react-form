import validatorjs from 'validatorjs';
import { Form } from '../../../../src';

const plugins = { dvr: validatorjs };

const fields = [
  'people',
  'people[]',
  'inventoryLevel.value',
];

const values = {
  emptyArray: [],
  people: [1, 2, 3, 4, 5, 6],
  inventoryLevel: {
    value: 2,
  },
};

const rules = {
  emptyArray: 'required|array',
  people: 'required|array|between:3,5',
};

export default new Form({ plugins, fields, values, rules }, 'Fixes-B');
