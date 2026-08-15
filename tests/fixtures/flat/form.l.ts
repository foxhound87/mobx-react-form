import ajv from "ajv";
import { Form } from "../../../src";
import ajvExtend from "../extension/ajv";
import ajvPlugin from "../../../src/validators/AJV";
import { FormInterface } from "../../../src/models/FormInterface";
import { ValidationPlugins } from "../../../src/models/ValidatorInterface";

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
  $async: true,
  type: "object",
  properties: {
    username: {
      type: "string",
      minLength: 6,
      maxLength: 20,
      checkUser: "user",
    },
    email: {
      type: "string",
      format: "email",
      minLength: 5,
      maxLength: 20,
    },
    password: { type: "string", minLength: 6, maxLength: 20 },
  },
};

const plugins: ValidationPlugins = {
  ajv: ajvPlugin({
    package: ajv,
    extend: ajvExtend,
    schema,
  }),
};

class NewForm extends Form {
  hooks() {
    return {
      onInit(form: FormInterface) {
        form.clear(); // to empty values
      },
    };
  }
}

export default new NewForm({ fields }, { plugins, name: "Flat-L" });
