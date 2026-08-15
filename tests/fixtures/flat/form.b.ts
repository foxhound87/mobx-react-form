import ajv from "ajv";
import validatorjs from "validatorjs";

import { Form } from "../../../src";
import ajvExtend from "../extension/ajv";

import dvr from "../../../src/validators/DVR";
import ajvPlugin from "../../../src/validators/AJV";
import { ValidationPlugins } from "../../../src/models/ValidatorInterface";

const fields = {
  username: {
    label: "Username",
  },
  email: {
    label: "Email",
    rules: "required|email|between:5,20",
  },
  password: {
    label: "Password",
  },
  devSkills: {
    label: "Dev Skills",
  },
};

const schema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 6, maxLength: 20 },
    // email: { type: 'string', format: 'email', minLength: 5, maxLength: 20 },
    password: { type: "string", minLength: 6, maxLength: 20 },
    devSkills: { range: [1, 10] },
  },
};

const plugins: ValidationPlugins = {
  dvr: dvr({ package: validatorjs }),
  ajv: ajvPlugin({
    schema,
    package: ajv,
    extend: ajvExtend,
  }),
};

const options = {
  alwaysShowDefaultError: true,
  defaultGenericError: "Custom Generic Error",
};

export default new Form({ fields }, { options, plugins, name: "Flat-B" });
