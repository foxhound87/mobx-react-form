import ajv from "ajv";
import { Form } from "../../../src";
import { shouldBeEqualTo } from "../extension/vjf";
import ajvExtend from "../extension/ajv";

import vjf from "../../../src/validators/VJF";
import ajvPlugin from "../../../src/validators/AJV";
import { ValidationPlugins } from "../../../src/models/ValidatorInterface";

const schema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 6, maxLength: 20 },
    email: { type: "string", format: "email", minLength: 5, maxLength: 20 },
    password: { type: "string", minLength: 6, maxLength: 20 },
    devSkills: { range: [5, 10] },
  },
};

const plugins: ValidationPlugins = {
  vjf: vjf(),
  ajv: ajvPlugin({
    package: ajv,
    extend: ajvExtend,
    schema,
  }),
};

const fields = {
  username: {
    label: "Username",
    value: "SteveJobs",
    validators: [shouldBeEqualTo("email")],
    related: ["email"],
  },
  email: {
    label: "Email",
    value: "s.jobs@apple.com",
  },
  password: {
    label: "Password",
    value: "thinkdifferent",
  },
  devSkills: {
    label: "Dev Skills",
    value: 5,
  },
};

export default new Form({ fields }, { plugins, name: "Flat-F" });
