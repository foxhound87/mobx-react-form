import Form from './_.extend';
import register from './register';
import company from './company';

class RegisterForm extends Form {}
class CompanyForm extends Form {}

export default {
  register: new RegisterForm({
    fields: register.fields,
    schema: register.schema,
  }),
  company: new CompanyForm({
    fields: company.fields,
    schema: company.schema,
  }),
};
