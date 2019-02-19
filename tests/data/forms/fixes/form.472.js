import { Form } from '../../../../src';

const fields = {};

class HookedForm extends Form {
  hooks() {
    return {
      onSuccess: form => form.values(),
      onSubmit: instance => instance
    };
  }
}

export default new HookedForm({ fields }, { name: 'Fixes-472' });
