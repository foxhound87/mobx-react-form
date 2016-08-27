import Form from './_.extend';

// forms
import register from './register';
import company from './company';

// extended ajv rules
import extend from '../../../tests/data/_.extend';

class RegisterForm extends Form {}
class CompanyForm extends Form {}

export default {
  register: new RegisterForm({
    extend,
    fields: register.fields,
    schema: register.schema,
  }),
  company: new CompanyForm({
    fields: company.fields,
    schema: company.schema,
    options: { allowRequired: true },
  }),
};
