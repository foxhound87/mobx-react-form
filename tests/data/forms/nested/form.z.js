import validatorjs from 'validatorjs';
import { Form } from '../../../../src';
import dvr from '../../../../src/validators/DVR';

const fields = [
  'data[].f1',
  'data[].f2',
  'data[].f3',
  'data[].f4',
  'data[].f5',
  'data[].f6',
  'data[].f7',
];

const values = {
  data: Array.from(Array(300).keys())
    .map(() => ({
      f1: Math.random(),
      f2: Math.random(),
      f3: Math.random(),
      f4: Math.random(),
      f5: Math.random(),
      f6: Math.random(),
      f7: Math.random(),
    })),
};

const plugins = {
  dvr: dvr(validatorjs)
};

export default new Form({
  fields, values,
}, { plugins, name: 'Nested-R' });
