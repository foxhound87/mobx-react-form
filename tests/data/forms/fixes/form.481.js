import { Form } from '../../../../src';

const values = {
  length: 0, // ISSUE #481
};

class NewForm extends Form {}

export default new NewForm({ values }, { name: 'Fixes-481' });
