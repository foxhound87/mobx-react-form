import ajv from "ajv";
import { Form } from "../../../../src";
import { checkUser } from "../../extension/vjf";

import svk from "../../../../src/validators/SVK";
import vjf from "../../../../src/validators/VJF";
import { FormInterface } from "../../../../src/models/FormInterface";
import { OptionsModel } from "../../../../src/models/OptionsModel";

const fields = {
  username: {
    label: "Username",
    value: "SteveJobs",
    validators: [checkUser], // (promise) should fail
  },
  email: {
    label: "Email",
    value: "12345", // should fail
  },
  password: {
    label: "Password",
    value: "thinkdifferent",
  },
};

const schema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 6, maxLength: 20 },
    email: { type: "string", format: "email", minLength: 5, maxLength: 20 },
    password: { type: "string", minLength: 6, maxLength: 20 },
  },
};

const plugins = {
  vjf: vjf(),
  svk: svk({
    package: ajv,
    schema,
  }),
};

const options: OptionsModel = {
  validateOnReset: true,
  validateOnClear: true,
};

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        // subsequent clear and reset
        form.clear(); // to empty values
        form.reset(); // to default or initial values
      },
    };
  }
}

export default new NewForm({ fields }, { options, plugins, name: "Flat-N" });
