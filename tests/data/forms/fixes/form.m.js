import validatorjs from 'validatorjs';
import { Form } from '../../../../src';

const fields = [
  'jobs',
  'jobs[].jobId',
  'jobs[].companyName',
];

const values = {
  jobs: [],
};

const rules = {
  'jobs[].companyName': 'required|string|between:3,75',
};

const plugins = {
  dvr: validatorjs,
};

class NewForm extends Form {

  // plugins() {
  //   return {
  //     dvr: validatorjs,
  //   };
  // }
}

export default new NewForm({ fields, values, rules }, { plugins, name: 'Fixes-M' });
