import validatorjs from 'validatorjs';
import MobxReactForm, { Field } from '../../../../src';
import { isEmail, shouldBeEqualTo } from '../../extension/vjf';
import dvr from '../../../../src/validators/DVR';

const fields = {
  email: {
    label: 'Email',
    value: '',
    rules: 'required|email'
  },
};

class NewForm extends MobxReactForm {

  options() {
    return {
      validateOnInit: true,
      showErrorsOnInit: true,
    };
  }

  plugins() {
    return {
      dvr: dvr(validatorjs),
    };
  }
}


export default new NewForm({ fields }, { name: 'Flat-S' });
