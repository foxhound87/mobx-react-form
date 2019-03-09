import validatorjs from 'validatorjs';
import { Form } from '../../../../src';
import dvr from '../../../../src/validators/DVR';

const plugins = {
  dvr: dvr(validatorjs),
};

const fields = [{
  name: 'passwordConfirm',
  label: 'Password Confirmation',
  rules: 'required_if:passwordRequired,true',
  value: '',
}, {
  name: 'passwordRequired',
  label: 'Password Required',
  type: 'checkbox',
  value: true,
  output: (value) => value === true ? 'true' : 'false',
}];

class NewForm extends Form {}

export default new NewForm({ fields }, { plugins, name: 'Fixes-480' });
