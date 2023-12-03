import ajv from "ajv";
import { Form } from "../../../../src";
import svk from "../../../../src/validators/SVK";
import { FormInterface } from "../../../../src/models/FormInterface";
import { OptionsModel } from "../../../../src/models/OptionsModel";
import { ValidationPlugins } from "../../../../src/models/ValidatorInterface";

const fields = {
  username: {
    label: "Username",
    value: "SteveJobs",
  },
  email: {
    label: "Email",
    value: "s.jobs@apple.com",
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

const plugins: ValidationPlugins = {
  svk: svk({
    package: ajv,
    schema,
  }),
};

class NewForm extends Form {
  options(): OptionsModel {
    return {
      strictUpdate: true,
    };
  }

  hooks() {
    return {
      onInit(form: FormInterface) {
        form.update({ username: "JonathanIve" });
        form.reset(); // to default or initial values
      },
    };
  }
}

export default new NewForm({ fields }, { plugins, name: "Flat-I" });
